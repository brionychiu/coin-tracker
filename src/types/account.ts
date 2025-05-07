export interface Account {
  id: string; // Firestore 自動生成
  label: string; // 帳戶名稱，例如「LINE Bank」
  createTime: string; // ISO 格式的時間字串
  createdBy: string | 'system'; // 使用者 UID 或 'system' 表示 base item
  deletedBy?: string[]; // 可選：儲存刪除這筆 base item 的用戶 UID 陣列
}
