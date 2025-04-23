'use client';

import { toast } from 'sonner';

import RecordForm from '@/components/form/RecordForm';
import { useConfirm } from '@/hooks/useConfirmModal';
import { usePaginatedRecords } from '@/hooks/usePaginatedRecords';
import { deleteAccountingRecord } from '@/lib/api/accounting';
import { AccountingRecord } from '@/types/accounting';
import SearchTable from './SearchTable';

export default function SearchPage() {
  const { records, loading, hasMore, hasLoadedOnce, loadMore, removeRecord } =
    usePaginatedRecords();
  const { confirm, ConfirmModal } = useConfirm();

  const handleDelete = async (record: AccountingRecord) => {
    confirm({
      title: '確認刪除',
      message: '確定要刪除此記錄嗎？此操作無法復原。',
      onConfirm: async () => {
        try {
          await deleteAccountingRecord(record.id);
          removeRecord(record.id);
          toast.success('刪除成功');
        } catch (error) {
          toast.error('刪除失敗，請稍後再試');
          console.error(error);
        }
      },
    });
  };

  const handleEdit = (record: AccountingRecord) => {
    // TODO: 可以跳 modal 或導向編輯頁
    console.log('Edit record', record);
  };

  return (
    <div className="p-6">
      <SearchTable
        records={records}
        loading={loading}
        hasMore={hasMore}
        hasLoadedOnce={hasLoadedOnce}
        loadMore={loadMore}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {ConfirmModal}
    </div>
  );
}
