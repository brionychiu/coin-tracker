'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AccountingRecord } from '@/types/accounting';
import { AlignEndHorizontal, ChartPie } from 'lucide-react';
import { BarChartBase } from './BarChartBase';
import { PieChartBase } from './PieChartBase';

interface IncomeChartSwitcherProps {
  records: AccountingRecord[];
  loading?: boolean;
}

export const IncomeChartSwitcher = ({
  records,
  loading = false,
}: IncomeChartSwitcherProps) => {
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
        className="absolute right-2 top-2 rounded-md p-1 hover:bg-gray-100"
        aria-label="切換圖表"
      >
        {icon}
      </Button>

      {chartType === 'pie' ? (
        <PieChartBase
          records={records}
          categoryType="income"
          loading={loading}
          title="收入類別比"
          emptyMessage="這段時間沒有收入資料"
        />
      ) : (
        <BarChartBase
          records={records}
          categoryType="income"
          loading={loading}
          title="收入金額"
          emptyMessage="這段時間沒有收入資料"
        />
      )}
    </div>
  );
};
