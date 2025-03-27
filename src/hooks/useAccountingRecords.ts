import { getAccountingRecords } from '@/lib/api/accounting';
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
