'use client';

import { useState } from 'react';

import { ExpenseChartSwitcher } from '@/components/chart/ExpenseChartSwitcher';
import { IncomeChartSwitcher } from '@/components/chart/IncomeChartSwitcher';
import { MultiAxisLineChart } from '@/components/chart/MultiAxisLineChart';
import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { DateRangeTabs, type DateRange } from '@/components/tabs/DateRangeTabs';
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
        <FullscreenLoading gifSrc="/loading-3.gif" />
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
            <div className="my-4 text-center text-gray-500">
              {getNoDataMessage()}
            </div>
          )}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 [&>*]:w-full">
            {expenseRecords.length > 0 && (
              <ExpenseChartSwitcher records={expenseRecords} />
            )}
            {incomeRecords.length > 0 && (
              <IncomeChartSwitcher records={incomeRecords} />
            )}
          </div>
          {(expenseRecords.length > 0 || incomeRecords.length > 0) && (
            <div className="mt-10 w-full max-w-4xl">
              <MultiAxisLineChart
                expenseRecords={expenseRecords}
                incomeRecords={incomeRecords}
                dateRange={dateRange}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
