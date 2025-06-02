import {
  addDoc,
  arrayUnion,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from '@/lib/firebase';
import { Account } from '@/types/account';

export const addAccount = async ({
  uid,
  label,
}: {
  uid: string;
  label: string;
}): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'accounts'), {
      label: label.trim(),
      createAt: new Date().toISOString(),
      createdBy: uid,
    });

    return docRef.id;
  } catch (error) {
    console.error('新增帳戶錯誤:', error);
    throw error;
  }
};

export const deleteAccount = async ({
  uid,
  accountId,
}: {
  uid: string;
  accountId: string;
}) => {
  const accountRef = doc(db, 'accounts', accountId);
  const accountSnap = await getDoc(accountRef);

  if (!accountSnap.exists()) {
    throw new Error('找不到該類別');
  }

  // 軟刪除
  await updateDoc(accountRef, {
    deletedBy: arrayUnion(uid),
  });
};

// 取得所有帳戶（包含軟刪除）
export const getAccountMap = async (
  uid: string,
): Promise<Record<string, Account>> => {
  if (!uid) throw new Error('使用者未登入');

  const categoryRef = collection(db, 'accounts');

  const q = query(
    categoryRef,
    or(where('createdBy', '==', 'system'), where('createdBy', '==', uid)),
  );

  const snapshot = await getDocs(q);

  const map: Record<string, Account> = {};
  snapshot.forEach((doc) => {
    const data = doc.data() as Account;
    map[doc.id] = { ...data, id: doc.id };
  });

  return map;
};

export async function fetchVisibleAccounts(): Promise<Account[]> {
  const res = await fetch('/api/accounts', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch accounts');
  }

  const data = await res.json();
  return data;
}
