import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export const formatToYearMonthGroup = (date: string | Date) => {
  return format(new Date(date), 'yyyy 年 M 月');
};

export const formatToShortDay = (date: string | Date) => {
  return format(new Date(date), 'M月d日 (EEE)', { locale: zhTW });
};

export const formatChartTimeKey = (date: string | Date, isYearView: boolean) => {
  const formattedDate = new Date(date);
  return isYearView
    ? format(formattedDate, 'MMM')
    : format(formattedDate, 'yyyy-MM-dd');
};
