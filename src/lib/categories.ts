import {
  Award,
  Beer,
  BriefcaseConveyorBelt,
  Car,
  CircleDollarSign,
  CirclePlus,
  Coins,
  CupSoda,
  Flower,
  Gamepad2,
  Gift,
  House,
  LayoutGrid,
  PiggyBank,
  Pill,
  ShoppingBag,
  ShoppingCart,
  Umbrella,
  Utensils,
  Wallet
} from 'lucide-react';

export interface Category {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

// 支出分類
export const EXPENSE_CATEGORIES: Category[] = [
  { icon: Utensils, label: '食物' },
  { icon: CupSoda, label: '飲品' },
  { icon: ShoppingCart, label: '生活雜貨' },
  { icon: Flower, label: '保持美麗' },
  { icon: Car, label: '汽車' },
  { icon: House, label: '房子' },
  { icon: Gamepad2, label: '遊戲' },
  { icon: Pill, label: '醫療' },
  { icon: ShoppingBag, label: '購物' },
  { icon: BriefcaseConveyorBelt, label: '交通' },
  { icon: Beer, label: '社交' },
  { icon: Gift, label: '禮物' },
  { icon: Umbrella, label: '保險' },
  { icon: LayoutGrid, label: '其他' },
  { icon: CirclePlus, label: '新增' },
];

// 收入分類
export const INCOME_CATEGORIES: Category[] = [
  { icon: Wallet, label: '薪水' },
  { icon: Award, label: '獎金' },
  { icon: Coins, label: '投資' },
  { icon: CircleDollarSign, label: '股利' },
  { icon: PiggyBank, label: '存款' },
  { icon: LayoutGrid, label: '其他' },
  { icon: CirclePlus, label: '新增' },
];
