import { AccountType } from '@/lib/accountOptions';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export interface AccountingRecord {
  date: Date;
  amount: string;
  category: string;
  account: AccountType;
  note?: string;
  images?: File[];
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
export async function addAccountingRecord(data: AccountingRecord) {
  try {
    // 上傳所有圖片並獲取下載 URL
    const imageUrls = data.images ? await Promise.all(data.images.map(uploadImage)) : [];

    const docRef = await addDoc(collection(db, 'accounting-records'), {
      date: data.date,
      amount: data.amount,
      category: data.category,
      account: data.account,
      note: data.note || '',
      images: imageUrls, // 存 URL，不是 File
    });

    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
}
