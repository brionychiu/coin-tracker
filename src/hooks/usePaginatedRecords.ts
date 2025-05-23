import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { getRecordsBatch } from '@/lib/api-client/accounting';
import { AccountingRecord } from '@/types/accounting';

export function usePaginatedRecords(batchSize = 100) {
  const { uid } = useAuth();

  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore || !uid) return;
    setLoading(true);

    const last = records[records.length - 1];
    const lastDate = last?.date ?? null;
    const newRecords = await getRecordsBatch(uid, lastDate, batchSize);

    setRecords((prev) => {
      const existingIds = new Set(prev.map((r) => r.id));
      const filtered = newRecords.filter((r) => !existingIds.has(r.id));
      return [...prev, ...filtered];
    });

    setHasMore(newRecords.length === batchSize);
    setLoading(false);
    setHasLoadedOnce(true);
  };

  useEffect(() => {
    loadMore();
  }, []);

  const updateRecord = (updated: AccountingRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
    );
  };

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
    updateRecord,
  };
}
