import { auth } from '@/lib/firebase';
import { endOfMonth, startOfMonth } from 'date-fns';

import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getDownloadURL,
  limit,
  onSnapshot,
  orderBy,
  query,
  ref,
  startAfter,
  storage,
  Timestamp,
  updateDoc,
  uploadBytes,
  where,
} from '@/lib/firebase';
import { convertToTimestamp } from '@/lib/utils';
import { AccountingRecord, AccountingRecordPayload } from '@/types/accounting';

/**
 * 上傳單張圖片到 Firebase Storage
 */
async function uploadImage(file: File): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未登入，無法上傳圖片');
  
  const storageRef = ref(storage, `receipts/${uid}/${file.name}-${Date.now()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * 新增一筆記帳紀錄到 Firestore
 */
export async function addAccountingRecord(data: AccountingRecordPayload) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('未登入');

  try {
    // 上傳所有圖片並獲取下載 URL
    const imageUrls = data.newImages ? await Promise.all(data.newImages.map(uploadImage)) : [];

    const docRef = await addDoc(collection(db, 'accounting-records'), {
      uid,
      date: data.date,
      amount: data.amount,
      category: data.category,
      categoryType: data.categoryType,
      account: data.account,
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
export async function updateAccountingRecord(id: string, data: AccountingRecordPayload) {
  try {
    const recordRef = doc(db, 'accounting-records', id);
    
    let imageUrls: string[] = [];

    if (data.newImages) {
      const newImageUrls = await Promise.all(
        data.newImages.map((image) => uploadImage(image))
      );
      imageUrls = [...newImageUrls];
    }

    if (data.oldImages) {
      imageUrls = [...imageUrls, ...data.oldImages];
    }

    const { newImages, oldImages, ...cleanData } = data;

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

    // 刪除記錄
    await deleteDoc(recordRef);

    console.log('Document deleted with ID: ', id);
  } catch (error) {
    console.error('刪除失敗:', error);
    throw error;
  }
}

/**
 * 監聽指定月份的 Firestore 記帳紀錄
 */
export function getAccountingRecords(
  month: number,
  callback: (data: AccountingRecord[]) => void
) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const now = new Date();
  const startOfMonthDate = new Date(now.getFullYear(), month, 1);
  const startTimestamp = Timestamp.fromDate(
    startOfMonth(startOfMonthDate)
  );
  const endTimestamp = Timestamp.fromDate(
    endOfMonth(startOfMonthDate)
  );

  const q = query(
    collection(db, 'accounting-records'),
    where('uid', '==', uid),
    where('date', '>=', startTimestamp),
    where('date', '<=', endTimestamp),
    orderBy('date') 
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Timestamp 轉 Date
    })) as AccountingRecord[];

    callback(data);
  });

  return unsubscribe;
}

/**
 * 監聽日期區間的 Firestore 記帳紀錄
 */
export function getAccountingRecordsByRange(
  startDate: Date,
  endDate: Date,
  callback: (data: AccountingRecord[]) => void
) {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const startTimestamp = Timestamp.fromDate(startDate);
  const endTimestamp = Timestamp.fromDate(endDate);

  const q = query(
    collection(db, 'accounting-records'),
    where('uid', '==', uid),
    where('date', '>=', startTimestamp),
    where('date', '<=', endTimestamp)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Timestamp 轉 Date
    })) as AccountingRecord[];

    callback(data);
  });

  return unsubscribe;
}

export async function getRecordsBatch(lastDate: Date | null, batchSize: number): Promise<AccountingRecord[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const recordsRef = collection(db, 'accounting-records');

  let q = query(
    recordsRef,
    where('uid', '==', uid),
    orderBy('date', 'desc'), // 降冪排序，最新的記錄排前面
    limit(batchSize) 
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
export async function getAccountingRecordById(id: string): Promise<AccountingRecord | null> {
  const uid = auth.currentUser?.uid;
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
