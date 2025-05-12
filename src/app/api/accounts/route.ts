import { collection, db, getDocs, orderBy, query, where } from '@/lib/firebase';
import { Account } from '@/types/account';
import { NextResponse } from 'next/server';

export async function getVisibleAccounts(uid: string | undefined) {
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. 取得 system 預設類別
  const systemQuery = query(
    collection(db, 'accounts'),
    where('createdBy', '==', 'system'),
    orderBy('createTime', 'asc'),
  );

  // 2. 取得使用者自訂類別
  const userQuery = query(
    collection(db, 'accounts'),
    where('createdBy', '==', uid),
    orderBy('createTime', 'asc'),
  );

  const [systemSnap, userSnap] = await Promise.all([
    getDocs(systemQuery),
    getDocs(userQuery),
  ]);

  const systemAccounts = systemSnap.docs
    .map((doc) => ({
      id: doc.id,
      label: doc.data().label,
      createTime: doc.data().createTime,
      createdBy: doc.data().createdBy,
      deletedBy: doc.data().deletedBy,
    }))
    .filter((acc: Account) => !acc.deletedBy?.includes(uid));

  const userAccounts = userSnap.docs
    .map((doc) => ({
      id: doc.id,
      label: doc.data().label,
      createTime: doc.data().createTime,
      createdBy: doc.data().createdBy,
      deletedBy: doc.data().deletedBy,
    }))
    .filter((acc: Account) => !acc.deletedBy?.includes(uid)); // 雖然理論上不會被刪除，但為保險還是過濾一下

  const accounts: Account[] = [...systemAccounts, ...userAccounts];

  return accounts;
}
