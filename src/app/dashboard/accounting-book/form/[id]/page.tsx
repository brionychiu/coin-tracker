'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import RecordForm from '@/components/form/RecordForm';
import { useAccountingRecordById } from '@/hooks/useAccountingRecords';
import { useDateStore } from '@/stores/dateStore';

export default function RecordFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setDate, date: selectedDate } = useDateStore();

  const isNew = id === 'new';
  const { record, loading } = useAccountingRecordById(
    typeof id === 'string' ? id : null,
  );

  useEffect(() => {
    if (record?.date) {
      setDate(new Date(record.date));
    }
  }, [record, setDate]);

  useEffect(() => {
    if (!loading && !isNew && !record) {
      // 資料不存在，導回列表
      router.replace('/accounting-book');
    }
  }, [loading, isNew, record, router]);

  const handleClose = () => {
    router.push('/dashboard/accounting-book');
  };

  if (loading) return <FullscreenLoading />;

  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <RecordForm
        date={
          record?.date
            ? new Date(record.date)
            : isNew
              ? selectedDate
              : undefined
        }
        record={record}
        onCancel={handleClose}
        onSave={handleClose}
      />
    </div>
  );
}
