import { AccountType } from '@/lib/accountOptions';

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