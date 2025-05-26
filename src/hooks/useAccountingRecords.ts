import { isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  getAccountingRecordById,
  getAccountingRecords,
  getAccountingRecordsByRange,
} from '@/lib/api-client/accounting';
import { AccountingRecord } from '@/types/accounting';

export function useAccountingRecords(selectedDate: Date | undefined) {
  const { uid } = useAuth();

  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AccountingRecord[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedDate || !uid) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = getAccountingRecords(uid, selectedDate, (data) => {
      setRecords(data);

      setFilteredRecords(
        data.filter((record) => isSameDay(record.date, selectedDate)),
      );
    });

    setLoading(false);

    return () => unsubscribe();
  }, [uid, selectedDate]);

  return { records, filteredRecords, loading };
}

export function useAccountingRecordsByRange(
  startDate: Date | null,
  endDate: Date | null,
  categoryType?: 'income' | 'expense',
) {
  const { uid } = useAuth();

  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!startDate || !endDate || !uid) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = getAccountingRecordsByRange(
      uid,
      startDate,
      endDate,
      (data) => {
        const filtered = categoryType
          ? data.filter((record) => record.categoryType === categoryType)
          : data;

        setRecords(filtered);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [startDate, endDate, categoryType]);

  return { records, loading };
}

export function useAccountingRecordById(id: string | null) {
  const { uid } = useAuth();

  const [record, setRecord] = useState<AccountingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    if (!id || id === 'new') {
      setRecord(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAccountingRecordById(uid, id)
      .then((res) => setRecord(res))
      .catch((err) => {
        console.error('載入記帳紀錄失敗:', err);
        setRecord(null);
      })
      .finally(() => setLoading(false));
  }, [uid, id]);

  return { record, loading };
}
