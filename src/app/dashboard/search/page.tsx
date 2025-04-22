'use client';

import { Search } from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAccountLabel } from '@/lib/account';
import { getRecordsBatch } from '@/lib/api/accounting';
import { getCategoryIcon, getCategoryInfo } from '@/lib/categories';
import { formatToShortDay, formatToYearMonthGroup } from '@/lib/format';
import { AccountingRecord } from '@/types/accounting';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// 高亮多關鍵字
function highlightText(text: string, rawKeyword: string) {
  const keywords = rawKeyword.trim().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return text;

  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    keywords.some((kw) => part.toLowerCase() === kw.toLowerCase()) ? (
      <mark key={i} className="bg-yellow-200 text-black">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function SearchPage() {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const batchSize = 100;

  useEffect(() => {
    loadMore();
  }, []);

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
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef.current, records]);

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
      <div className="relative max-h-[600px] overflow-auto rounded-xl border">
        {/* sticky 標題 */}
        <div className="sticky top-0 z-30 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>類別</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>備註</TableHead>
                <TableHead className="text-right">金額</TableHead>
                <TableHead>帳戶</TableHead>
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

              <Table>
                <TableBody>
                  {groupItems.map((record) => (
                    <TableRow key={record.id} className="hover:bg-[#FFF3F2]">
                      <TableCell className="flex items-center gap-2">
                        <div className="relative flex h-8 w-8 items-center justify-center">
                          <span
                            className={`absolute h-5 w-5 rounded-full opacity-70 shadow-md blur-sm ${
                              record.categoryType === 'income'
                                ? 'bg-green-01'
                                : 'bg-primary-01'
                            }`}
                          />
                          <div className="relative z-10 text-2xl">
                            {getCategoryIcon(record.category)}
                          </div>
                        </div>
                        {getCategoryInfo(record.category).label}
                      </TableCell>
                      <TableCell>{formatToShortDay(record.date)}</TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {record.note
                          ? highlightText(record.note, debouncedKeyword)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {record.amount}
                      </TableCell>
                      <TableCell>{getAccountLabel(record.account)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))
        )}

        {hasMore && hasLoadedOnce && (
          <div
            ref={observerRef}
            className="p-4 text-center text-muted-foreground"
          >
            載入中...
          </div>
        )}
      </div>
    </>
  );
}
