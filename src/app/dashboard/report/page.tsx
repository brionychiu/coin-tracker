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

  return (
    <>
      {expenseLoading || incomeLoading ? (
        <FullscreenLoading gifSrc="/loading-3.gif" />
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
          <DateRangeTabs value={dateRange} onChange={setDateRange} />
          <div className="grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 [&>*]:w-full">
            <ExpenseChartSwitcher records={expenseRecords} />
            <IncomeChartSwitcher records={incomeRecords} />
          </div>
          <div className="mt-10 w-full max-w-4xl">
            <MultiAxisLineChart
              expenseRecords={expenseRecords}
              incomeRecords={incomeRecords}
              dateRange={dateRange}
            />
          </div>
        </div>
      )}
    </>
  );
}
