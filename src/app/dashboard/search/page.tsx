'use client';

import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Search } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';

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
import { getRecordsBatch } from '@/lib/api/accounting'; // 你需要根據資料來實作
import { getCategoryIcon, getCategoryInfo } from '@/lib/categories';
import { AccountingRecord } from '@/types/accounting';

export default function SearchPage() {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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
    const newRecords = await getRecordsBatch(lastDate, batchSize); // 要實作：依照日期倒序取資料
    setRecords((prev) => [...prev, ...newRecords]);
    setHasMore(newRecords.length === batchSize);
    setLoading(false);
  };

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [observerRef.current, records]);

  // 分組 by yyyy/MM
  const groupedRecords = records.reduce(
    (acc, record) => {
      const group = format(record.date, 'yyyy/MM');
      if (!acc[group]) acc[group] = [];
      acc[group].push(record);
      return acc;
    },
    {} as Record<string, AccountingRecord[]>,
  );

  return (
    <>
      <div className="flex w-full justify-center p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder="按備註搜尋" className="pl-10" />
        </div>
      </div>
      <div className="relative max-h-[600px] overflow-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-white">
              <TableHead>類別</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>備註</TableHead>
              <TableHead className="text-right">金額</TableHead>
              <TableHead>帳戶</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedRecords).map(([group, groupItems]) => (
              <Fragment key={group}>
                <TableRow className="sticky top-10 z-[5] bg-muted">
                  <TableCell colSpan={5} className="py-2 text-lg font-bold">
                    {group}
                  </TableCell>
                </TableRow>
                {groupItems.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="flex items-center gap-2">
                      <span>{getCategoryIcon(record.category)}</span>
                      {getCategoryInfo(record.category).label}
                    </TableCell>
                    <TableCell>
                      {format(record.date, 'MM月dd日 (EEE)', { locale: zhTW })}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {record.note ?? '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {record.amount}
                    </TableCell>
                    <TableCell>{getAccountLabel(record.account)}</TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
        {hasMore && (
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
