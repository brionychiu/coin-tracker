import {
  getCategoryLabel,
} from '@/lib/categories';
import { AccountingRecord } from '@/types/accounting';

const graphBgColors = [
  'rgba(255, 99, 132, 0.5)',   // 粉紅紅
  'rgba(54, 162, 235, 0.5)',   // 柔藍
  'rgba(255, 206, 86, 0.5)',   // 柔黃
  'rgba(75, 192, 192, 0.5)',   // 湖水綠
  'rgba(153, 102, 255, 0.5)',  // 柔紫
  'rgba(255, 159, 64, 0.5)',   // 柔橘
  'rgba(255, 105, 180, 0.5)',  // 粉紅
  'rgba(100, 181, 246, 0.5)',  // 淡藍
  'rgba(255, 138, 101, 0.5)',  // 橘粉
  'rgba(174, 213, 129, 0.5)',  // 淡綠
  'rgba(129, 212, 250, 0.5)',  // 天藍
  'rgba(255, 183, 77, 0.5)',   // 亮橘
  'rgba(240, 98, 146, 0.5)',   // 暗粉
  'rgba(179, 157, 219, 0.5)',  // 淡紫
  'rgba(128, 222, 234, 0.5)',  // 淡青
  'rgba(255, 171, 145, 0.5)',  // 淺珊瑚
  'rgba(244, 143, 177, 0.5)',  // 粉莓
  'rgba(206, 147, 216, 0.5)',  // 薰衣草
  'rgba(159, 168, 218, 0.5)',  // 淡靛
  'rgba(255, 213, 79, 0.5)',   // 金黃
];

// Pie chart, Bar chart
export function getCategoryChartData(
  records: AccountingRecord[],
  categoryType: 'expense' | 'income' = 'expense'
) {
  const filtered = records.filter((r) => r.categoryType === categoryType);

  const categoryMap: Record<string, number> = {};
  for (const record of filtered) {
    const amount = parseFloat(record.amount);
    categoryMap[record.category] = (categoryMap[record.category] || 0) + amount;
  }

  // 排序：金額高的排在前面
  const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const total = entries.reduce((sum, [, val]) => sum + val, 0);

  const labels = entries.map(([code]) => getCategoryLabel(code));
  const data = entries.map(([, val]) => val);
  const percentages = data.map((val) =>
    total > 0 ? parseFloat(((val / total) * 100).toFixed(2)) : 0
  );
  const colors = entries.map((_, idx) => graphBgColors[idx % graphBgColors.length]);

  return {
    labels,
    data,
    percentages,
    colors,
    total,
  };
}
