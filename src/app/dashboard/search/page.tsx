'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import RecordForm from '@/components/form/RecordForm';
import { useConfirm } from '@/hooks/useConfirmModal';
import { usePaginatedRecords } from '@/hooks/usePaginatedRecords';
import { deleteAccountingRecord } from '@/lib/api/accounting';
import { AccountingRecord } from '@/types/accounting';
import SearchTable from './SearchTable';

export default function SearchPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const {
    records,
    loading,
    hasMore,
    hasLoadedOnce,
    updateRecord,
    loadMore,
    removeRecord,
  } = usePaginatedRecords();
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
    setIsEditing(true);
    setEditRecord(record);

    if (record?.date) {
      const recordDate = new Date(record.date);
      setDate(recordDate);
    }
  };

  const handleSaveEdit = (updated?: AccountingRecord) => {
    if (!updated) return;
    updateRecord(updated);
    setIsEditing(false);
    setEditRecord(null);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditRecord(null);
  };

  return (
    <>
      {isEditing ? (
        <div className="flex w-full items-center justify-center">
          <RecordForm
            date={editRecord?.date || date}
            record={editRecord}
            onCancel={handleCloseEdit}
            onSave={handleSaveEdit}
          />
        </div>
      ) : (
        <SearchTable
          records={records}
          loading={loading}
          hasMore={hasMore}
          hasLoadedOnce={hasLoadedOnce}
          loadMore={loadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {ConfirmModal}
    </>
  );
}
