import { format } from 'date-fns';

export const formatKey = (date: string | Date, isYearView: boolean) => {
  const formattedDate = new Date(date);
  return isYearView
    ? format(formattedDate, 'MMM')
    : format(formattedDate, 'yyyy-MM-dd');
};
