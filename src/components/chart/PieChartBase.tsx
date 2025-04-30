'use client';

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

import { getCategoryChartData } from '@/lib/chart';
import { AccountingRecord } from '@/types/accounting';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartBaseProps {
  records: AccountingRecord[];
  categoryType: 'expense' | 'income';
  title: string;
}

export const PieChartBase = ({
  records,
  categoryType,
  title,
}: PieChartBaseProps) => {
  const { labels, data, percentages, total, colors } = getCategoryChartData(
    records,
    categoryType,
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: `${categoryType === 'expense' ? '支出' : '收入'}比例`,
        data,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        align: 'start' as const,
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
      <h3 className="mb-1 text-lg font-normal text-gray-02">${total}</h3>
      <Pie data={chartData} options={options} />
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
