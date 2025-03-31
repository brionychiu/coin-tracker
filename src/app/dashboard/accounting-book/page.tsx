'use client';

import { CustomCalendar } from '@/app/dashboard/accounting-book/CustomCalendar';
import RecordForm from '@/app/dashboard/accounting-book/RecordForm';
import Records from '@/app/dashboard/accounting-book/Records';
import { Button } from '@/components/ui/button';
import { AccountingRecord } from '@/types/accounting';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AccountingBookPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<number>(
    date?.getMonth() ?? new Date().getMonth(),
  );

  const handleMonthChange = (newDate: Date) => {
    setMonth(newDate.getMonth());
  };

  const handleEdit = (record: AccountingRecord) => {
    setIsEditing(true);
    setEditRecord(record);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditRecord(null);
  };

  return (
    <div className="f-full mx-auto h-full rounded-2xl border bg-white shadow 2xl:max-w-6xl">
      <div className="flex flex-row p-6">
        <div className="flex w-96 flex-col items-center">
          {!isEditing && (
            <>
              <CustomCalendar
                mode="single"
                selected={date}
                onSelect={setDate}
                onMonthChange={handleMonthChange}
                className="p-4"
              />
              <Button onClick={() => setIsEditing(true)}>
                <Plus />
                新增記帳
              </Button>
            </>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <RecordForm
              date={editRecord?.date || date} // 如果有編輯資料，使用編輯資料的日期
              record={editRecord} // 傳遞當前編輯資料
              onCancel={handleCloseEdit}
              onSave={handleCloseEdit}
            />
          ) : (
            <Records date={date} month={month} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
