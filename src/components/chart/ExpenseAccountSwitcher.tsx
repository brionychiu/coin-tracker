import { AlignEndHorizontal, ChartPie } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AccountingRecord } from '@/types/accounting';

import { BarChartBase } from './BarChartBase';
import { PieChartBase } from './PieChartBase';

interface ExpenseAccountSwitcherProps {
  records: AccountingRecord[];
}

export const ExpenseAccountSwitcher = ({
  records,
}: ExpenseAccountSwitcherProps) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('bar');

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
          title="支出帳戶比"
          groupBy="account"
        />
      ) : (
        <BarChartBase
          records={records}
          categoryType="expense"
          title="支出帳戶金額"
          groupBy="account"
        />
      )}
    </div>
  );
};
