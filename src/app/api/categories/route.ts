import { collection, db, getDocs, orderBy, query, where } from '@/lib/firebase';
import { Category } from '@/types/category';
import { NextResponse } from 'next/server';

export async function getVisibleCategories(
  uid: string | undefined,
  type: 'income' | 'expense',
) {
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 取得 system 預設類別
  const systemQuery = query(
    collection(db, 'categories'),
    where('type', '==', type),
    where('createdBy', '==', 'system'),
    orderBy('createTime', 'asc'),
  );

  // 2. 取得使用者自訂類別
  const userQuery = query(
    collection(db, 'categories'),
    where('type', '==', type),
    where('createdBy', '==', uid),
    orderBy('createTime', 'asc'),
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
      createTime: doc.data().createTime,
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
      createTime: doc.data().createTime,
      createdBy: doc.data().createdBy,
      deletedBy: doc.data().deletedBy,
    }))
    .filter((cat: Category) => !cat.deletedBy?.includes(uid));

  const categories: Category[] = [...systemCategories, ...userCategories];

  return categories;
}
