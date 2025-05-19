import { NextResponse } from 'next/server';

import { collection, db, getDocs, orderBy, query, where } from '@/lib/firebase';
import { Category } from '@/types/category';

export async function getVisibleCategories(uid: string | undefined) {
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 取得 system 預設類別
  const systemQuery = query(
    collection(db, 'categories'),
    where('createdBy', '==', 'system'),
    orderBy('createAt', 'asc'),
  );

  // 2. 取得使用者自訂類別
  const userQuery = query(
    collection(db, 'categories'),
    where('createdBy', '==', uid),
    orderBy('createAt', 'asc'),
  );

  const [systemSnap, userSnap] = await Promise.all([
    getDocs(systemQuery),
    getDocs(userQuery),
  ]);

  const systemCategories = systemSnap.docs
    .map((doc) => ({
      id: doc.id,
      label: doc.data().label,
      icon: doc.data().icon,
      type: doc.data().type,
      createAt: doc.data().createAt,
      createdBy: doc.data().createdBy,
      deletedBy: doc.data().deletedBy,
    }))
    .filter((cat: Category) => !cat.deletedBy?.includes(uid));

  const userCategories = userSnap.docs
    .map((doc) => ({
      id: doc.id,
      label: doc.data().label,
      icon: doc.data().icon,
      type: doc.data().type,
      createAt: doc.data().createAt,
      createdBy: doc.data().createdBy,
      deletedBy: doc.data().deletedBy,
    }))
    .filter((cat: Category) => !cat.deletedBy?.includes(uid));

  const categories: Category[] = [...systemCategories, ...userCategories];

  return categories;
}
