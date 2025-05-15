'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAccountMap } from '@/hooks/useAccountMap';
import { useCategoryMap } from '@/hooks/useCategoryMap';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { formatToYearMonthGroup } from '@/lib/utils/format';
import { AccountingRecord } from '@/types/accounting';
import { GroupCardSection } from './GroupCardSection';
import { GroupTableSection } from './GroupTableSection';

interface RecordsProps {
  records: AccountingRecord[];
  loading: boolean;
  hasMore: boolean;
  hasLoadedOnce: boolean;
  loadMore: () => void;
  onEdit: (record: AccountingRecord) => void;
  onDelete: (record: AccountingRecord) => void;
}

export default function SearchTable({
  records,
  loading,
  hasMore,
  loadMore,
  hasLoadedOnce,
  onEdit,
  onDelete,
}: RecordsProps) {
  const { categoryMap } = useCategoryMap();
  const { accountMap } = useAccountMap();

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const loaderRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  });

  const filteredRecords = useMemo(() => {
    const keywords = debouncedKeyword
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (!keywords.length) return records;

    return records.filter((record) =>
      keywords.every((kw) => record.note?.toLowerCase().includes(kw)),
    );
  }, [records, debouncedKeyword]);

  const groupedRecords = useMemo(() => {
    return filteredRecords.reduce(
      (acc, record) => {
        const group = formatToYearMonthGroup(record.date);
        (acc[group] ||= []).push(record);
        return acc;
      },
      {} as Record<string, AccountingRecord[]>,
    );
  }, [filteredRecords]);

  const isEmpty = Object.keys(groupedRecords).length === 0;

  const renderEmptyState = () => (
    <div className="p-6 text-center text-muted-foreground">
      找不到符合{' '}
      <span className="font-semibold text-foreground">{debouncedKeyword}</span>{' '}
      的紀錄
    </div>
  );

  return (
    <>
      <div className="mb-10 flex w-full justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="按備註搜尋"
            className="pl-10 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="relative mb-8 hidden max-h-screen-minus-200 overflow-auto rounded-xl border md:block">
        <div className="sticky top-0 z-30 bg-white">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[12.5%]">類別</TableHead>
                <TableHead className="w-[12.5%]">日期</TableHead>
                <TableHead className="w-[37.5%]">備註</TableHead>
                <TableHead className="w-[12.5%] text-right">帳戶</TableHead>
                <TableHead className="w-[25%]">金額</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {!hasLoadedOnce || loading ? (
          <FullscreenLoading />
        ) : isEmpty ? (
          renderEmptyState()
        ) : (
          Object.entries(groupedRecords).map(([group, groupItems]) => (
            <GroupTableSection
              key={group}
              group={group}
              groupItems={groupItems}
              debouncedKeyword={debouncedKeyword}
              accountMap={accountMap}
              categoryMap={categoryMap}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}

        {hasMore && hasLoadedOnce && (
          <div
            ref={loaderRef}
            className="p-4 text-center text-muted-foreground"
          >
            載入中...
          </div>
        )}
      </div>

      <div className="block md:hidden">
        {!hasLoadedOnce || loading ? (
          <FullscreenLoading />
        ) : isEmpty ? (
          renderEmptyState()
        ) : (
          Object.entries(groupedRecords).map(([group, groupItems]) => (
            <GroupCardSection
              key={group}
              group={group}
              groupItems={groupItems}
              debouncedKeyword={debouncedKeyword}
              accountMap={accountMap}
              categoryMap={categoryMap}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </>
  );
}
