'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import { useAccountMap } from '@/hooks/useAccountMap';
import { useCategoryMap } from '@/hooks/useCategoryMap';
import { getAccountChartData, getCategoryChartData } from '@/lib/utils/chart';
import { AccountingRecord } from '@/types/accounting';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartBaseProps {
  records: AccountingRecord[];
  categoryType: 'expense' | 'income';
  title: string;
  groupBy?: 'category' | 'account';
}

export const BarChartBase = ({
  records,
  categoryType,
  title,
  groupBy = 'category',
}: BarChartBaseProps) => {
  const { categoryMap } = useCategoryMap();
  const { accountMap } = useAccountMap();

  const chartDataSet =
    groupBy === 'category'
      ? getCategoryChartData(records, categoryMap, categoryType)
      : getAccountChartData(records, accountMap, categoryType);

  const { labels, data, percentages, total, colors } = chartDataSet;

  const chartData = {
    labels,
    datasets: [
      {
        label: '',
        data,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <h3 className="mb-1 font-normal text-gray-02">
        <span className="text-sm">NT$</span>
        <span className="text-lg">{total.toLocaleString()}</span>
      </h3>
      <Bar data={chartData} options={chartOptions} />
      <div className="mt-4">
        <ul>
          {labels.map((label, index) => (
            <li key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <span>{label}</span>
              </div>
              <p className="flex items-center">
                <span className="mr-2">{percentages[index]}%</span>
                <span className="text-sm text-gray-02">NT$</span>
                <span className="text-gray-02">
                  {data[index].toLocaleString()}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
