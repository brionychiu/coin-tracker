'use client';

import { useState } from 'react';

import { ExpenseChartSwitcher } from '@/components/chart/ExpenseChartSwitcher';
import { IncomeChartSwitcher } from '@/components/chart/IncomeChartSwitcher';
import { LineChart } from '@/components/chart/LineChart';
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
    <div className="flex w-full flex-row justify-center rounded-md border p-4 shadow">
      <div className="p-4">
        <DateRangeTabs value={dateRange} onChange={setDateRange} />
        <ExpenseChartSwitcher
          records={expenseRecords}
          loading={expenseLoading}
        />
        <IncomeChartSwitcher records={incomeRecords} loading={incomeLoading} />
        <LineChart />
      </div>
    </div>
  );
}
