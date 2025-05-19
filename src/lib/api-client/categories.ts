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
import { Category } from '@/types/category';

// TODO: 上線後要刪除
const EXPENSE_CATEGORIES = [
  {
    icon: 'Utensils',
    label: '食物',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:00:00',
  },
  {
    icon: 'CupSoda',
    label: '飲品',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:01:00',
  },
  {
    icon: 'ShoppingCart',
    label: '生活雜貨',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:02:00',
  },
  {
    icon: 'Flower',
    label: '保持美麗',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:03:00',
  },
  {
    icon: 'Car',
    label: '汽車',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:04:00',
  },
  {
    icon: 'House',
    label: '房子',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:05:00',
  },
  {
    icon: 'Gamepad2',
    label: '遊戲',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:06:00',
  },
  {
    icon: 'Pill',
    label: '醫療保健',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:07:00',
  },
  {
    icon: 'ShoppingBag',
    label: '購物',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:08:00',
  },
  {
    icon: 'BriefcaseConveyorBelt',
    label: '交通',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:09:00',
  },
  {
    icon: 'Beer',
    label: '社交',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:10:00',
  },
  {
    icon: 'Phone',
    label: '通訊',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:11:00',
  },
  {
    icon: 'Gift',
    label: '禮物',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:12:00',
  },
  {
    icon: 'Umbrella',
    label: '保險',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:13:00',
  },
  {
    icon: 'LayoutGrid',
    label: '其他',
    type: 'expense',
    createdBy: 'system',
    createAt: '2020-10-10T00:14:00',
  },
];

const INCOME_CATEGORIES = [
  {
    icon: 'Wallet',
    label: '薪水',
    type: 'income',
    createdBy: 'system',
    createAt: '2020-10-10T00:00:00',
  },
  {
    icon: 'Award',
    label: '獎金',
    type: 'income',
    createdBy: 'system',
    createAt: '2020-10-10T00:01:00',
  },
  {
    icon: 'Coins',
    label: '投資',
    type: 'income',
    createdBy: 'system',
    createAt: '2020-10-10T00:02:00',
  },
  {
    icon: 'CircleDollarSign',
    label: '股利',
    type: 'income',
    createdBy: 'system',
    createAt: '2020-10-10T00:03:00',
  },
  {
    icon: 'PiggyBank',
    label: '存款',
    type: 'income',
    createdBy: 'system',
    createAt: '2020-10-10T00:04:00',
  },
  {
    icon: 'LayoutGrid',
    label: '其他',
    type: 'income',
    createdBy: 'system',
    createAt: '2020-10-10T00:05:00',
  },
];

// TODO: 上線後要刪除
// 新增 base item 時，會將 createdBy 設為 'system'，
// 之後使用者刪除時，會將 deletedBy 設為使用者的 uid 陣列
export const uploadCategories = async () => {
  const categoriesRef = collection(db, 'categories');

  const upload = async (
    items: typeof EXPENSE_CATEGORIES,
    type: 'income' | 'expense',
  ) => {
    for (const item of items) {
      await addDoc(categoriesRef, {
        ...item,
        type,
        createdBy: 'system',
      });
    }
    console.log(`✅ ${type} 類別上傳成功`);
  };

  await upload(EXPENSE_CATEGORIES, 'expense');
  await upload(INCOME_CATEGORIES, 'income');
  console.log('🎉 所有類別上傳完成');
};

export interface AddCategoryPayload {
  uid: string;
  label: string;
  icon: string;
  type: 'income' | 'expense';
}

export const addCategory = async (payload: AddCategoryPayload) => {
  const { uid, label, icon, type } = payload;

  if (!uid) throw new Error('使用者未登入');
  if (!label || !icon || !type) {
    throw new Error('請提供類別名稱、圖示和類型');
  }

  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      label,
      icon,
      type,
      createAt: new Date().toISOString(),
      createdBy: uid,
    });

    return docRef.id;
  } catch (error) {
    console.error('新增類別錯誤:', error);
    throw error;
  }
};

export const deleteCategory = async ({
  uid,
  categoryId,
}: {
  uid: string;
  categoryId: string;
}) => {
  if (!uid) throw new Error('使用者未登入');

  const categoryRef = doc(db, 'categories', categoryId);
  const categorySnap = await getDoc(categoryRef);

  if (!categorySnap.exists()) {
    throw new Error('找不到該類別');
  }

  // 軟刪除
  await updateDoc(categoryRef, {
    deletedBy: arrayUnion(uid),
  });
};

// 取得所有類別（包含軟刪除）
export const getCategoryMap = async (
  uid: string,
): Promise<Record<string, Category>> => {
  if (!uid) throw new Error('使用者未登入');

  const categoryRef = collection(db, 'categories');

  const q = query(
    categoryRef,
    or(where('createdBy', '==', 'system'), where('createdBy', '==', uid)),
  );

  const snapshot = await getDocs(q);

  const map: Record<string, Category> = {};
  snapshot.forEach((doc) => {
    const data = doc.data() as Category;
    map[doc.id] = { ...data, id: doc.id };
  });

  return map;
};
