import { Timestamp } from '@/lib/firebase';
import { formatYearMonthString } from '@/lib/utils/format';

/**
 * 將 Date 或 null 轉成 Firestore Timestamp
 * @param date - JS Date 物件或 null
 * @returns Firestore Timestamp
 */
export function convertToTimestamp(date: Date | null): Timestamp {
  return date ? Timestamp.fromDate(date) : Timestamp.now();
}

/**
 * 根據目標日期與當前日期，決定使用哪個月份。
 * 如果目標日期大於今天，則回傳今天的月份，否則回傳目標日期的月份。
 */
export function getEffectiveYearMonth(targetDate: Date): string {
  const todayYearMonth = formatYearMonthString(new Date());
  const targetYearMonth = formatYearMonthString(targetDate);

  return targetYearMonth > todayYearMonth ? todayYearMonth : targetYearMonth;
}
