import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractFileName = (url: string): string => {
  return decodeURIComponent(url.split('/').pop()?.split('?')[0] || '未知檔名');
};