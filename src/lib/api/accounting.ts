import { AccountType } from '@/lib/accountOptions';
import { db, storage } from '@/lib/firebase';
import { endOfMonth, startOfMonth } from 'date-fns';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// Firestore 存的記帳紀錄（Firestore 內的格式）
export interface AccountingRecord {
  id: string;
  date: Date;
  amount: string;
  category: string;
  account: AccountType;
  note?: string;
  images: string[]; // Firestore 存的 `images` 是 URL 陣列
}

// 新增時使用的型別（含 File 陣列）
export interface AccountingRecordPayload {
  date: Date;
  amount: string;
  category: string;
  account: AccountType;
  note?: string;
  images?: File[]; // 新增時是 File 陣列，Firestore 會轉成 URL 陣列
}

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