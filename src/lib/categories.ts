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
  Phone,
  PiggyBank,
  Pill,
  ShoppingBag,
  ShoppingCart,
  Umbrella,
  Utensils,
  Wallet
} from 'lucide-react';
import React from 'react';

export interface Category {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  code: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { icon: Utensils, label: '食物', code: 'food' },
  { icon: CupSoda, label: '飲品', code: 'drink' },
  { icon: ShoppingCart, label: '生活雜貨', code: 'groceries' },
  { icon: Flower, label: '保持美麗', code: 'beauty' },
  { icon: Car, label: '汽車', code: 'car' },
  { icon: House, label: '房子', code: 'house' },
  { icon: Gamepad2, label: '遊戲', code: 'games' },
  { icon: Pill, label: '醫療保健', code: 'medical' },
  { icon: ShoppingBag, label: '購物', code: 'shopping' },
  { icon: BriefcaseConveyorBelt, label: '交通', code: 'transport' },
  { icon: Beer, label: '社交', code: 'social' },
  { icon: Phone, label: '通訊', code: 'communication' },
  { icon: Gift, label: '禮物', code: 'gifts' },
  { icon: Umbrella, label: '保險', code: 'insurance' },
  { icon: LayoutGrid, label: '其他', code: 'other' },
  { icon: CirclePlus, label: '新增', code: 'add' },
];

export const INCOME_CATEGORIES: Category[] = [
  { icon: Wallet, label: '薪水', code: 'salary' },
  { icon: Award, label: '獎金', code: 'bonus' },
  { icon: Coins, label: '投資', code: 'investment' },
  { icon: CircleDollarSign, label: '股利', code: 'dividends' },
  { icon: PiggyBank, label: '存款', code: 'savings' },
  { icon: LayoutGrid, label: '其他', code: 'other' },
  { icon: CirclePlus, label: '新增', code: 'add' },
];

// 根據 category code 取得對應的 category label
export const getCategoryLabel = (code: string): string => {
  const category = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find(
    (category) => category.code === code
  );
  return category ? category.label : '未知類別'; 
};

// 根據 category code 取得對應的 category label 和類別類型
export const getCategoryInfo = (code: string): { label: string; categoryType: 'expense' | 'income' } => {
  const expenseCategory = EXPENSE_CATEGORIES.find((category) => category.code === code);
  if (expenseCategory) {
    return { label: expenseCategory.label, categoryType: 'expense' };
  }

  const incomeCategory = INCOME_CATEGORIES.find((category) => category.code === code);
  if (incomeCategory) {
    return { label: incomeCategory.label, categoryType: 'income' };
  }

  throw new Error(`未知的 category code：${code}`);
};

// 根據 category code 取得對應的 category icon
export const getCategoryIcon = (code: string): React.JSX.Element => {
  const category = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find(
    (category) => category.code === code
  );

  // 使用 React.createElement 動態渲染組件
  return category
    ? React.createElement(category.icon, { className: 'h-6 w-6' })
    : React.createElement(LayoutGrid, { className: 'h-6 w-6' });
};