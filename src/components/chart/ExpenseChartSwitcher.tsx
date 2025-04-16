import { useState } from 'react';

import { AccountingRecord } from '@/types/accounting';
import { AlignEndHorizontal, ChartPie } from 'lucide-react';
import { BarChartBase } from './BarChartBase';
import { PieChartBase } from './PieChartBase';

interface ExpenseChartSwitcherProps {
  records: AccountingRecord[];
  loading?: boolean;
}

export const ExpenseChartSwitcher = ({
  records,
  loading = false,
}: ExpenseChartSwitcherProps) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const toggleChart = () => {
    setChartType((prev) => (prev === 'pie' ? 'bar' : 'pie'));
  };

  const icon =
    chartType === 'pie' ? (
      <AlignEndHorizontal size={20} />
    ) : (
      <ChartPie size={20} />
    );

  return (
    <div className="relative">
      <button
        onClick={toggleChart}
        className="absolute right-2 top-2 rounded-md p-1 hover:bg-gray-100"
        aria-label="切換圖表"
      >
        {icon}
      </button>

      {chartType === 'pie' ? (
        <PieChartBase
          records={records}
          loading={loading}
          categoryType="expense"
          title="支出類別比"
          emptyMessage="沒有支出紀錄"
        />
      ) : (
        <BarChartBase
          records={records}
          loading={loading}
          categoryType="expense"
          title="支出類別金額"
          emptyMessage="沒有支出紀錄"
        />
      )}
    </div>
  );
};
