import { addDoc, collection, db } from '@/lib/firebase';

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
