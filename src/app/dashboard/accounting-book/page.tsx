'use client';

import AddRecord from '@/app/dashboard/accounting-book/AddRecord';
import { CustomCalendar } from '@/app/dashboard/accounting-book/CustomCalendar';
import Records from '@/app/dashboard/accounting-book/Records';
import { useState } from 'react';
export default function AccountingBookPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<number>(
    date?.getMonth() ?? new Date().getMonth(),
  );

  const handleMonthChange = (newDate: Date) => {
    setMonth(newDate.getMonth()); // 提取月份並更新狀態
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-center">
        <CustomCalendar
          mode="single"
          selected={date}
          onSelect={setDate}
          onMonthChange={handleMonthChange} // 🔥 監聽月份變更
          className="rounded-md border p-4 shadow"
        />
        <Records date={date} month={month} />
      </div>
      <div className="flex flex-row justify-center">
        <AddRecord />
      </div>
    </div>
  );
}
