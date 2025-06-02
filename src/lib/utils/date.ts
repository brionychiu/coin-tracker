import { getDate, isAfter, isSameMonth, subMonths } from 'date-fns';

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
 * 1. 如果「今天」是當月 1, 2 號，無論目標日期是否在未來，都 fallback 上個月。
 * 2. 如果目標日期在未來 → 回傳今天的月份。
 * 3. 否則 → 回傳目標日期的月份。
 */
export function getEffectiveYearMonth(targetDate: Date): string {
  const today = new Date();
  const todayYearMonth = formatYearMonthString(today);
  const targetYearMonth = formatYearMonthString(targetDate);

  if (getDate(today) <= 2 && isSameMonth(targetDate, today)) {
    const prevMonth = subMonths(targetDate, 1);
    return formatYearMonthString(prevMonth);
  }

  if (isAfter(targetDate, today)) {
    return todayYearMonth;
  }

  return targetYearMonth;
}
