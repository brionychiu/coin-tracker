import { db, storage } from '@/lib/firebase';
import { AccountingRecord, AccountingRecordPayload } from '@/types/accounting';
import { endOfMonth, startOfMonth } from 'date-fns';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

/**
 * 上傳單張圖片到 Firebase Storage
 */
async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, `receipts/${file.name}-${Date.now()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * 新增一筆記帳紀錄到 Firestore
 */
export async function addAccountingRecord(data: AccountingRecordPayload) {
  try {
    // 上傳所有圖片並獲取下載 URL
    const imageUrls = data.images ? await Promise.all(data.images.map(uploadImage)) : [];

    const docRef = await addDoc(collection(db, 'accounting-records'), {
      date: data.date,
      amount: data.amount,
      category: data.category,
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
    
    // 檢查是否有新的圖片需要上傳
    let imageUrls = data.images ? await Promise.all(
      data.images.map(async (image) => {
        if (image instanceof File) {
          return await uploadImage(image); // 上傳並獲取 URL
        }
        return image; // 若是已有的 URL，則直接返回
      })
    ) : [];

    // 更新 Firestore
    await updateDoc(recordRef, {
      ...data,
      images: imageUrls, // 確保 images 是 URL 陣列，而非 File
    });

  } catch (error) {
    console.error('更新失敗:', error);
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