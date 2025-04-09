import { accountOptions } from '@/lib/accountOptions';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAccountLabel = (value: string): string => {
  return accountOptions.find((option) => option.value === value)?.label || '未知帳戶';
};