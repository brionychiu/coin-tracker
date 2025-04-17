'use client';

import { getCategoryChartData } from '@/lib/chart';
import { AccountingRecord } from '@/types/accounting';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartBaseProps {
  records: AccountingRecord[];
  categoryType: 'expense' | 'income';
  title: string;
  emptyMessage: string;
}

export const BarChartBase = ({
  records,
  categoryType,
  title,
  emptyMessage,
}: BarChartBaseProps) => {
  if (!records || records.length === 0) {
    return <p className="py-4 text-center">{emptyMessage}</p>;
  }

  const { labels, data, percentages, total, colors } = getCategoryChartData(
    records,
    categoryType,
  );

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
    plugins: {
      legend: {
        display: false, // 隱藏圖例
      },
    },
  };
  return (
    <div className="rounded-md border p-4 shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <h3 className="text-gray-02 mb-3 text-lg font-normal">${total}</h3>
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
              <p className="flex items-center gap-3">
                <span>{percentages[index]}%</span>
                <span className="text-gray-02">${data[index]}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
