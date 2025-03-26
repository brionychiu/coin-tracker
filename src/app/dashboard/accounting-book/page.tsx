'use client';

import AddRecord from '@/app/dashboard/accounting-book/AddRecord';
import { CustomCalendar } from '@/app/dashboard/accounting-book/CustomCalendar';
import Records from '@/app/dashboard/accounting-book/Records';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AccountingBookPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<number>(
    date?.getMonth() ?? new Date().getMonth(),
  );

  const handleMonthChange = (newDate: Date) => {
    setMonth(newDate.getMonth());
  };

  return (
    <div className="f-full mx-auto h-full rounded-2xl border bg-white shadow 2xl:max-w-6xl">
      <div className="flex flex-row p-6">
        <div className="flex w-96 flex-col items-center">
          <CustomCalendar
            mode="single"
            selected={date}
            onSelect={setDate}
            onMonthChange={handleMonthChange}
            className="p-4"
          />
          <Button onClick={() => setIsAdding(true)}>
            <Plus />
            新增記帳
          </Button>
        </div>
        <div className="flex-1">
          {isAdding ? (
            <AddRecord
              onCancel={() => setIsAdding(false)}
              onSave={() => setIsAdding(false)}
            />
          ) : (
            <Records date={date} month={month} />
          )}
        </div>
      </div>
    </div>
  );
}
