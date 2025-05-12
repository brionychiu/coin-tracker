import { Timestamp } from '@/lib/firebase';

/**
 * 將 Date 或 null 轉成 Firestore Timestamp
 * @param date - JS Date 物件或 null
 * @returns Firestore Timestamp
 */
export function convertToTimestamp(date: Date | null): Timestamp {
  return date ? Timestamp.fromDate(date) : Timestamp.now();
}
