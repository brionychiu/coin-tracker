'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CustomCalendar } from '@/app/dashboard/accounting-book/CustomCalendar';
import Records from '@/app/dashboard/accounting-book/Records';
import RecordForm from '@/components/form/RecordForm';
import { Button } from '@/components/ui/button';
import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { useDateStore } from '@/stores/dateStore';
import { AccountingRecord } from '@/types/accounting';

export default function AccountingBookPage() {
  const { date, setDate } = useDateStore();
  const month = date ? date.getMonth() : new Date().getMonth();

  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);

  // TODO: 可以考慮是否將 Records.tsx 的 useAccountingRecords 部分也放在這裡
  const { records } = useAccountingRecords(date, month);
  const recordDates = records.map((record) => new Date(record.date));

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleEdit = (record: AccountingRecord) => {
    setIsEditing(true);
    setEditRecord(record);

    if (record?.date) {
      const recordDate = new Date(record.date);
      setDate(recordDate);
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditRecord(null);
    if (date) {
      setDate(date);
    }
  };

  return (
    <div className="mx-auto h-full w-full max-w-6xl bg-white">
      <div className="flex flex-row gap-6">
        {isEditing ? (
          <div className="flex w-full items-center justify-center">
            <RecordForm
              date={editRecord?.date || date}
              record={editRecord}
              onCancel={handleCloseEdit}
              onSave={handleCloseEdit}
            />
          </div>
        ) : (
          <>
            <div className="flex w-96 flex-col items-center">
              <CustomCalendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                month={new Date(new Date().getFullYear(), month)}
                onMonthChange={handleMonthChange}
                recordDates={recordDates}
                className="p-4"
              />
              <Button onClick={() => setIsEditing(true)}>
                <Plus />
                新增記帳
              </Button>
            </div>
            <div className="flex-1">
              <Records date={date} month={month} onEdit={handleEdit} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
