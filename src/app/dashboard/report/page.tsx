'use client';

import { useState } from 'react';

import { ExpenseCategorySwitcher } from '@/components/chart/ExpenseCategorySwitcher';
import { IncomeCategorySwitcher } from '@/components/chart/IncomeCategorySwitcher';
import { MultiAxisLineChart } from '@/components/chart/MultiAxisLineChart';
import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { type DateRange, DateRangeTabs } from '@/components/tabs/DateRangeTabs';
import { useAccountingRecordsByRange } from '@/hooks/useAccountingRecords';

export default function ReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [tab, setTab] = useState<'month' | 'year' | 'recent'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const { records: expenseRecords, loading: expenseLoading } =
    useAccountingRecordsByRange(
      dateRange?.startDate ?? null,
      dateRange?.endDate ?? null,
      'expense',
    );
  const { records: incomeRecords, loading: incomeLoading } =
    useAccountingRecordsByRange(
      dateRange?.startDate ?? null,
      dateRange?.endDate ?? null,
      'income',
    );

  const getNoDataMessage = () => {
    if (expenseRecords.length === 0 && incomeRecords.length === 0) {
      return '這段時間沒有收支紀錄';
    }
    if (expenseRecords.length === 0) {
      return '這段時間沒有支出紀錄';
    }
    if (incomeRecords.length === 0) {
      return '這段時間沒有收入紀錄';
    }
    return null;
  };

  return (
    <>
      {expenseLoading || incomeLoading ? (
        <FullscreenLoading />
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
          <DateRangeTabs
            tab={tab}
            currentDate={currentDate}
            onTabChange={setTab}
            onDateChange={setCurrentDate}
            onRangeChange={setDateRange}
          />
          {getNoDataMessage() && (
            <div className="mb-8 text-center text-gray-500">
              {getNoDataMessage()}
            </div>
          )}
          <div className="grid w-full gap-10 sm:grid-cols-1 md:grid-cols-3 [&>*]:w-full">
            {expenseRecords.length > 0 && (
              <ExpenseCategorySwitcher records={expenseRecords} />
            )}
            {incomeRecords.length > 0 && (
              <IncomeCategorySwitcher records={incomeRecords} />
            )}
            {(expenseRecords.length > 0 || incomeRecords.length > 0) && (
              <MultiAxisLineChart
                expenseRecords={expenseRecords}
                incomeRecords={incomeRecords}
                dateRange={dateRange}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
