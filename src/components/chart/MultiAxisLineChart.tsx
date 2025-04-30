'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { type DateRange } from '@/components/tabs/DateRangeTabs';
import { formatChartTimeKey } from '@/lib/format';
import { AccountingRecord } from '@/types/accounting';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

interface MultiAxisLineChartProps {
  expenseRecords: AccountingRecord[];
  incomeRecords: AccountingRecord[];
  dateRange: DateRange | null;
}

export const MultiAxisLineChart = ({
  expenseRecords,
  incomeRecords,
  dateRange,
}: MultiAxisLineChartProps) => {
  if (!dateRange) {
    return <p className="py-4 text-center">日期範圍未提供</p>;
  }

  const isYearView =
    new Date(dateRange.endDate).getFullYear() >
    new Date(dateRange.startDate).getFullYear();

  // Group data by day or month based on the view
  const groupData = (records: AccountingRecord[], isYearView: boolean) => {
    const grouped: Record<string, { income: number; expense: number }> = {};

    records.forEach((record) => {
      const key = formatChartTimeKey(record.date, isYearView);
      const amount = parseFloat(record.amount);

      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 };
      }

      if (record.categoryType === 'income') {
        grouped[key].income += amount;
      } else if (record.categoryType === 'expense') {
        grouped[key].expense += amount;
      }
    });

    return grouped;
  };

  const groupedExpenseData = groupData(expenseRecords, isYearView);
  const groupedIncomeData = groupData(incomeRecords, isYearView);

  // Extract sorted keys (dates)
  const sortedKeys = Array.from(
    new Set([
      ...Object.keys(groupedExpenseData),
      ...Object.keys(groupedIncomeData),
    ]),
  ).sort();

  const labels = sortedKeys;
  const expenseData = sortedKeys.map(
    (key) => groupedExpenseData[key]?.expense || 0,
  );
  const incomeData = sortedKeys.map(
    (key) => groupedIncomeData[key]?.income || 0,
  );

  const datasets = [];

  if (incomeRecords.length > 0) {
    datasets.push({
      label: '收入',
      data: incomeData,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      yAxisID: 'y1',
    });
  }

  if (expenseRecords.length > 0) {
    datasets.push({
      label: '支出',
      data: expenseData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      yAxisID: 'y2',
    });
  }

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y1: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: '收入',
        },
      },
      y2: {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: '支出',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-md border p-4 shadow">
      <h2 className="mb-2 text-lg font-semibold">收入 vs 支出</h2>
      <Line data={data} options={options} />
    </div>
  );
};
