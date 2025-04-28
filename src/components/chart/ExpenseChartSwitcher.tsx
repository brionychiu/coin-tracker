import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AccountingRecord } from '@/types/accounting';
import { AlignEndHorizontal, ChartPie } from 'lucide-react';
import { BarChartBase } from './BarChartBase';
import { PieChartBase } from './PieChartBase';

interface ExpenseChartSwitcherProps {
  records: AccountingRecord[];
}

export const ExpenseChartSwitcher = ({
  records,
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
      <Button
        type="button"
        variant="iconHover"
        size="icon"
        onClick={toggleChart}
        className="absolute right-2 top-2 rounded-md p-1"
        aria-label="切換圖表"
      >
        {icon}
      </Button>

      {chartType === 'pie' ? (
        <PieChartBase
          records={records}
          categoryType="expense"
          title="支出類別比"
        />
      ) : (
        <BarChartBase
          records={records}
          categoryType="expense"
          title="支出類別金額"
        />
      )}
    </div>
  );
};
