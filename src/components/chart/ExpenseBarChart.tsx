import { AccountingRecord } from '@/types/accounting';
import { BarChartBase } from './BarChartBase';

interface ExpenseBarChartProps {
  records: AccountingRecord[];
  loading?: boolean;
}

export const ExpenseBarChart = ({ records, loading }: ExpenseBarChartProps) => (
  <BarChartBase
    records={records}
    loading={loading}
    categoryType="expense"
    title="支出類別金額"
    emptyMessage="沒有支出紀錄"
  />
);
