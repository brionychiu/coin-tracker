export interface Category {
  id: string; // Firestore 自動生成
  label: string; // 顯示名稱
  icon: string; // lucide-react icon 名稱，如 'ShoppingCart'
  type: 'income' | 'expense';
  createAt: string; // ISO 格式的時間字串
  createdBy: string | 'system'; // UID 或 'system' 表示 base item
  deletedBy?: string[]; // 可選：儲存刪除這筆 base item 的用戶 UID 陣列
}
