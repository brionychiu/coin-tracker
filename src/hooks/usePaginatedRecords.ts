import { useEffect, useState } from 'react';

import { getRecordsBatch } from '@/lib/api/accounting';
import { AccountingRecord } from '@/types/accounting';

export function usePaginatedRecords(batchSize = 100) {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const last = records[records.length - 1];
    const lastDate = last?.date ?? null;
    const newRecords = await getRecordsBatch(lastDate, batchSize);

    setRecords((prev) => [...prev, ...newRecords]);
    setHasMore(newRecords.length === batchSize);
    setLoading(false);
    setHasLoadedOnce(true);
  };

  useEffect(() => {
    loadMore();
  }, []);

  const removeRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  return {
    records,
    loading,
    hasMore,
    hasLoadedOnce,
    loadMore,
    removeRecord,
  };
}
