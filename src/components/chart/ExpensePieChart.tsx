import { AccountingRecord } from '@/types/accounting';
import { PieChartBase } from './PieChartBase';

interface ExpensePieChartProps {
  records: AccountingRecord[];
  loading?: boolean;
}

export const ExpensePieChart = ({ records, loading }: ExpensePieChartProps) => (
  <PieChartBase
    records={records}
    loading={loading}
    categoryType="expense"
    title="支出類別比"
    emptyMessage="沒有支出紀錄"
  />
);
