import { endOfMonth, startOfMonth } from 'date-fns';

import {
  addDoc,
  collection,
  db,
  deleteDoc,
  deleteObject,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  limit,
  onSnapshot,
  orderBy,
  query,
  ref,
  ref as storageRefFromURL,
  startAfter,
  storage,
  Timestamp,
  updateDoc,
  uploadBytes,
  where,
} from '@/lib/firebase';
import { convertToTimestamp } from '@/lib/utils/date';
import { addUnsubscribe } from '@/lib/utils/firestore-unsubscribe';
import { useAuthStore } from '@/stores/authStore';
import { AccountingRecord, AccountingRecordPayload } from '@/types/accounting';

/**
 * 上傳單張圖片到 Firebase Storage
 */
async function uploadImage(uid: string, file: File): Promise<string> {
  if (!uid) throw new Error('未登入，無法上傳圖片');

  const storageRef = ref(storage, `receipts/${uid}/${file.name}-${Date.now()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * 新增一筆記帳紀錄到 Firestore
 */
export async function addAccountingRecord(
  uid: string,
  data: AccountingRecordPayload,
) {
  if (!uid) throw new Error('未登入');

  try {
    // 上傳所有圖片並獲取下載 URL
    const imageUrls = data.newImages
      ? await Promise.all(data.newImages.map((file) => uploadImage(uid, file)))
      : [];

    const docRef = await addDoc(collection(db, 'accounting-records'), {
      uid,
      createAt: data.createAt,
      date: data.date,
      accountId: data.accountId,
      amount: data.amount,
      currency: data.currency,
      exchangeRate: data.exchangeRate,
      categoryId: data.categoryId,
      categoryType: data.categoryType,
      note: data.note,
      images: imageUrls, // 存的是 URL 陣列
    });

    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
}

/**
 * 更新一筆記帳紀錄到 Firestore
 */
export async function updateAccountingRecord(
  uid: string,
  id: string,
  data: AccountingRecordPayload,
) {
  try {
    const recordRef = doc(db, 'accounting-records', id);
    const recordSnap = await getDoc(recordRef);

    if (!recordSnap.exists()) throw new Error('紀錄不存在');

    const existingData = recordSnap.data();
    const existingImages: string[] = existingData.images || [];

    // 上傳新圖片
    let imageUrls: string[] = [];
    if (data.newImages) {
      const newImageUrls = await Promise.all(
        data.newImages.map((image) => uploadImage(uid, image)),
      );
      imageUrls = [...newImageUrls];
    }

    // 合併仍保留的舊圖片
    if (data.oldImages) {
      imageUrls = [...imageUrls, ...data.oldImages];
    }

    // 找出被刪除的圖片 URL（Firestore 中有，但 data.oldImages 沒有）
    const removedImageUrls = existingImages.filter(
      (url: string) => !data.oldImages?.includes(url),
    );

    // 刪除 Storage 中對應的圖片
    await Promise.all(
      removedImageUrls.map(async (url) => {
        try {
          const imageRef = storageRefFromURL(storage, url);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('刪除圖片失敗', url, error);
        }
      }),
    );

    const { newImages: _newImages, oldImages: _oldImages, ...cleanData } = data;
    await updateDoc(recordRef, {
      ...cleanData,
      images: imageUrls,
    });

    return {
      id,
      ...cleanData,
      images: imageUrls,
    };
  } catch (error) {
    console.error('更新失敗:', error);
    throw error;
  }
}

/**
 * 刪除一筆記帳紀錄
 */
export async function deleteAccountingRecord(id: string) {
  try {
    const recordRef = doc(db, 'accounting-records', id);
    const recordSnap = await getDoc(recordRef);

    if (!recordSnap.exists()) throw new Error('找不到記帳紀錄');

    const data = recordSnap.data();
    const images: string[] = data.images || [];

    // 刪除 Storage 裡的實體圖片
    await Promise.all(
      images.map(async (url) => {
        try {
          const storageRef = storageRefFromURL(storage, url);
          await deleteObject(storageRef);
        } catch (error) {
          console.warn('刪除圖片失敗:', url, error);
        }
      }),
    );

    // 刪除 Firestore 裡的紀錄
    await deleteDoc(recordRef);
    console.log('Document and images deleted with ID:', id);
  } catch (error) {
    console.error('刪除失敗:', error);
    throw error;
  }
}

/**
 * 取得指定日期所在月份的所有記帳記錄，並透過 callback 即時更新資料
 */
export function getAccountingRecords(
  uid: string,
  date: Date,
  callback: (data: AccountingRecord[]) => void,
) {
  if (!uid) return () => {};

  const startOfMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const startTimestamp = Timestamp.fromDate(startOfMonth(startOfMonthDate));
  const endTimestamp = Timestamp.fromDate(endOfMonth(startOfMonthDate));

  const q = query(
    collection(db, 'accounting-records'),
    where('uid', '==', uid),
    where('date', '>=', startTimestamp),
    where('date', '<=', endTimestamp),
    orderBy('createAt', 'desc'),
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Timestamp 轉 Date
    })) as AccountingRecord[];

    callback(data);
  });

  addUnsubscribe(unsubscribe);

  return unsubscribe;
}

/**
 * 監聽日期區間的 Firestore 記帳紀錄
 */
export function getAccountingRecordsByRange(
  uid: string,
  startDate: Date,
  endDate: Date,
  callback: (data: AccountingRecord[]) => void,
) {
  if (!uid) return () => {};

  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(
    collection(db, 'accounting-records'),
    where('uid', '==', uid),
    where('date', '>=', startTimestamp),
    where('date', '<=', endTimestamp),
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Timestamp 轉 Date
    })) as AccountingRecord[];

    callback(data);
  });

  addUnsubscribe(unsubscribe);

  return unsubscribe;
}

export async function getRecordsBatch(
  uid: string,
  lastDate: Date | null,
  batchSize: number,
): Promise<AccountingRecord[]> {
  if (!uid) return [];

  const recordsRef = collection(db, 'accounting-records');

  let q = query(
    recordsRef,
    where('uid', '==', uid),
    orderBy('date', 'desc'), // 降冪排序，最新的記錄排前面
    limit(batchSize),
  );

  if (lastDate) {
    const lastTimestamp = convertToTimestamp(lastDate);
    q = query(q, startAfter(lastTimestamp));
  }

  try {
    const querySnapshot = await getDocs(q);
    const records: AccountingRecord[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Timestamp 轉 Date
    })) as AccountingRecord[];

    return records;
  } catch (error) {
    console.error('載入記帳資料失敗:', error);
    return [];
  }
}

/**
 * 根據 ID 取得單筆記帳紀錄
 */
export async function getAccountingRecordById(
  uid: string,
  id: string,
): Promise<AccountingRecord | null> {
  if (!uid) return null;

  try {
    const recordRef = doc(db, 'accounting-records', id);
    const recordSnap = await getDoc(recordRef);

    if (!recordSnap.exists()) return null;

    const data = recordSnap.data();

    if (data.uid !== uid) return null;

    return {
      id: recordSnap.id,
      ...data,
      date: data.date.toDate(), // Timestamp 轉 Date
    } as AccountingRecord;
  } catch (error) {
    console.error('取得單筆記帳資料失敗:', error);
    return null;
  }
}
