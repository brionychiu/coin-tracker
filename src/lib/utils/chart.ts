import { useCategoryMap } from '@/hooks/useCategoryMap';
import { graphBgColors } from '@/lib/constants/chartColors';
import { getCategoryLabelById } from '@/lib/utils/categories';
import { AccountingRecord } from '@/types/accounting';

// Pie chart, Bar chart
export function getCategoryChartData(
  records: AccountingRecord[],
  categoryType: 'expense' | 'income' = 'expense',
) {
  const { categoryMap } = useCategoryMap();

  const filtered = records.filter((r) => r.categoryType === categoryType);

  const amountByCategoryId: Record<string, number> = {};
  for (const record of filtered) {
    const amountInTWD = parseFloat(
      (parseFloat(record.amount) / (record.exchangeRate ?? 1)).toFixed(),
    );
    amountByCategoryId[record.categoryId] =
      (amountByCategoryId[record.categoryId] || 0) + amountInTWD;
  }

  // 排序：金額高的排在前面
  const entries = Object.entries(amountByCategoryId).sort(
    (a, b) => b[1] - a[1],
  );

  const total = entries.reduce((sum, [, val]) => sum + val, 0);

  const labels = entries.map(([id]) => getCategoryLabelById(id, categoryMap));
  const data = entries.map(([, val]) => val);
  const percentages = data.map((val) =>
    total > 0 ? parseFloat(((val / total) * 100).toFixed(2)) : 0,
  );
  const colors = entries.map(
    (_, idx) => graphBgColors[idx % graphBgColors.length],
  );

  return {
    labels,
    data,
    percentages,
    colors,
    total,
  };
}

// Pie chart, Bar chart - by Account
export function getAccountChartData(
  records: AccountingRecord[],
  accountMap: Record<string, { name: string }>,
  categoryType: 'expense' | 'income' = 'expense',
) {
  const filtered = records.filter((r) => r.categoryType === categoryType);

  const amountByAccountId: Record<string, number> = {};

  for (const record of filtered) {
    const amountInTWD = parseFloat(
      (parseFloat(record.amount) / (record.exchangeRate ?? 1)).toFixed(),
    );
    amountByAccountId[record.accountId] =
      (amountByAccountId[record.accountId] || 0) + amountInTWD;
  }

  const entries = Object.entries(amountByAccountId).sort((a, b) => b[1] - a[1]);

  const total = entries.reduce((sum, [, val]) => sum + val, 0);

  const labels = entries.map(
    ([accountId]) => accountMap[accountId]?.name ?? '未知帳戶',
  );
  const data = entries.map(([, val]) => val);
  const percentages = data.map((val) =>
    total > 0 ? parseFloat(((val / total) * 100).toFixed(2)) : 0,
  );
  const colors = entries.map(
    (_, idx) => graphBgColors[idx % graphBgColors.length],
  );

  return {
    labels,
    data,
    percentages,
    colors,
    total,
  };
}
