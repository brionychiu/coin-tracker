import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

/** yyyy 年 M 月 → 用於搜尋結果的月份群組 */
export const formatToYearMonthGroup = (date: string | Date) => {
  return format(new Date(date), 'yyyy 年 M 月');
};

/** M月d日 (EEE) → 用於搜尋表格中的日期顯示 */
export const formatToShortDay = (date: string | Date) => {
  return format(new Date(date), 'M月d日 (EEE)', { locale: zhTW });
};

/**
 * 根據是否跨年回傳圖表用的時間 key
 * - 月視圖：yyyy-MM-dd
 * - 年視圖：MMM
 */
export const formatChartTimeKey = (
  date: string | Date,
  isYearView: boolean,
) => {
  const formattedDate = new Date(date);
  return isYearView
    ? format(formattedDate, 'MMM')
    : format(formattedDate, 'yyyy-MM-dd');
};
