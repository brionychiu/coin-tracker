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

export async function fetchVisibleCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await res.json();
  return data;
}
