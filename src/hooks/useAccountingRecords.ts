import { getAccountingRecords, getAccountingRecordsByRange } from '@/lib/api/accounting';
import { AccountingRecord } from '@/types/accounting';
import { isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';

export function useAccountingRecords(date: Date | undefined, month: number) {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getAccountingRecords(month, (data) => {
      setRecords(data);

      if (date) {
        setFilteredRecords(data.filter((record) => isSameDay(record.date, date)));
      }
    });

    setLoading(false);

    return () => unsubscribe();
  }, [month, date]); 

  return { records, filteredRecords, loading };
}

export function useAccountingRecordsByRange(
  startDate: Date | null,
  endDate: Date | null,
  categoryType?: 'income' | 'expense'
) {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate) return;

    setLoading(true);

    const unsubscribe = getAccountingRecordsByRange(startDate, endDate, (data) => {
      const filtered = categoryType
        ? data.filter((record) => record.categoryType === categoryType)
        : data;

      setRecords(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [startDate, endDate, categoryType]);

  return { records, loading };
}