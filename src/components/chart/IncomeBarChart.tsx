import { AccountingRecord } from '@/types/accounting';
import { BarChartBase } from './BarChartBase';

interface IncomeBarChartProps {
  records: AccountingRecord[];
  loading?: boolean;
}

export const IncomeBarChart = ({ records, loading }: IncomeBarChartProps) => (
  <BarChartBase
    records={records}
    loading={loading}
    categoryType="income"
    title="收入類別金額"
    emptyMessage="沒有收入紀錄"
  />
);
