// Firestore 存的記帳紀錄（Firestore 內的格式）
export interface AccountingRecord {
  id: string;
  createAt: string;
  date: Date;
  accountId: string;
  amount: string;
  currency: string;
  exchangeRate: number;
  categoryId: string;
  categoryType: 'expense' | 'income';
  note?: string;
  images: string[]; // Firestore 存的 `images` 是 URL 陣列
}

// 新增/編輯時使用的型別（含 File 陣列）
export interface AccountingRecordPayload {
  createAt: string;
  date: Date;
  accountId: string;
  amount: string;
  currency: string;
  exchangeRate: number;
  categoryId: string;
  categoryType: 'expense' | 'income';
  note?: string;
  oldImages?: string[]; // 已存在的圖片 URL
  newImages?: File[]; // 新增時是 File 陣列，Firestore 會轉成 URL 陣列
}
