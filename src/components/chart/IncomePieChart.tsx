import { AccountingRecord } from '@/types/accounting';
import { PieChartBase } from './PieChartBase';

interface IncomePieChartProps {
  records: AccountingRecord[];
  loading?: boolean;
}

export const IncomePieChart = ({ records, loading }: IncomePieChartProps) => (
  <PieChartBase
    records={records}
    loading={loading}
    categoryType="income"
    title="收入類別比"
    emptyMessage="沒有收入紀錄"
  />
);
