'use client';

import { Pencil, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { Button } from '@/components/ui/button';
import { highlightText } from '@/components/ui/highlight-text';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getAccountLabel } from '@/lib/account';
import { getCategoryIcon, getCategoryInfo } from '@/lib/categories';
import { formatToShortDay, formatToYearMonthGroup } from '@/lib/format';
import { AccountingRecord } from '@/types/accounting';

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
  onEdit,
  hasLoadedOnce,
  onDelete,
}: RecordsProps) {
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
      .split(/\s+/)
      .filter(Boolean)
      .map((k) => k.toLowerCase());

    if (keywords.length === 0) return records;
    return records.filter((record) =>
      keywords.every((kw) => record.note?.toLowerCase().includes(kw)),
    );
  }, [records, debouncedKeyword]);

  const groupedRecords = useMemo(() => {
    return filteredRecords.reduce(
      (acc, record) => {
        const group = formatToYearMonthGroup(record.date); // yyyy 年 M 月
        if (!acc[group]) acc[group] = [];
        acc[group].push(record);
        return acc;
      },
      {} as Record<string, AccountingRecord[]>,
    );
  }, [filteredRecords]);

  const isEmpty = Object.keys(groupedRecords).length === 0;

  return (
    <>
      <div className="flex w-full justify-center p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="按備註搜尋"
            className="pl-10"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>
      <div className="max-h-screen-minus-200 relative overflow-auto rounded-xl border">
        {/* sticky 標題 */}
        <div className="sticky top-0 z-30 bg-white">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">類別</TableHead>
                <TableHead className="w-1/6">日期</TableHead>
                <TableHead className="w-1/3">備註</TableHead>
                <TableHead className="w-1/6 text-right">帳戶</TableHead>
                <TableHead className="w-1/6">金額</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        {/* 狀態處理區塊 */}
        {!hasLoadedOnce || loading ? (
          <FullscreenLoading gifSrc="/loading-2.gif" />
        ) : isEmpty ? (
          <div className="p-6 text-center text-muted-foreground">
            找不到相關紀錄
          </div>
        ) : (
          Object.entries(groupedRecords).map(([group, groupItems]) => (
            <div key={group}>
              {/* sticky 的 group 標題 */}
              <div className="sticky top-[40px] z-20 bg-muted px-4 py-2 text-lg font-bold">
                {group}
              </div>

              <Table className="w-full table-fixed">
                <TableBody>
                  {groupItems.map((record) => (
                    <TableRow key={record.id} className="hover:bg-system-02">
                      <TableCell className="w-1/6">
                        <div className="flex items-center">
                          <div className="relative flex h-8 w-8 items-center justify-center">
                            <span
                              className={`absolute h-5 w-5 rounded-full opacity-80 ${
                                record.categoryType === 'income'
                                  ? 'bg-green-01'
                                  : 'bg-primary-03'
                              }`}
                            />
                            <div className="relative z-10 text-2xl">
                              {getCategoryIcon(record.category)}
                            </div>
                          </div>
                          <span>{getCategoryInfo(record.category).label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-1/6">
                        {formatToShortDay(record.date)}
                      </TableCell>
                      <TableCell className="w-1/3 truncate">
                        {record.note
                          ? highlightText(record.note, debouncedKeyword)
                          : '-'}
                      </TableCell>
                      <TableCell className="w-1/6 text-right">
                        {getAccountLabel(record.account)}
                      </TableCell>
                      <TableCell className="w-1/6 font-semibold">
                        <div className="flex justify-between">
                          <span>{record.amount}</span>
                          <div className="mt-1 flex gap-2">
                            <Button
                              type="button"
                              variant="iconHover"
                              size="icon"
                              onClick={() => onEdit(record)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="iconHover"
                              size="icon"
                              onClick={() => onDelete(record)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
    </>
  );
}
