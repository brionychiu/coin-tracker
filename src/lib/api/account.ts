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

// TODO: 預設帳戶，上線後刪除
const ACCOUNTS_CATEGORIES = [
  {
    label: '現金',
    createTime: '2020-10-10T00:00:00',
    createdBy: 'system',
  },
  {
    label: '銀行',
    createTime: '2020-10-10T00:01:00',
    createdBy: 'system',
  },
  {
    label: '信用卡',
    createTime: '2020-10-10T00:02:00',
    createdBy: 'system',
  },
];

// TODO: 預設帳戶，上線後刪除
export const uploadAccounts = async () => {
  const categoriesRef = collection(db, 'accounts');

  const upload = async (items: typeof ACCOUNTS_CATEGORIES) => {
    for (const item of items) {
      await addDoc(categoriesRef, {
        ...item,
        createdBy: 'system',
      });
    }
  };

  await upload(ACCOUNTS_CATEGORIES);
  console.log('🎉 所有類別上傳完成');
};

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
      createTime: new Date().toISOString(),
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
