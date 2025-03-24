'use client';

import { AccountingBookCalendar } from '@/components/page/AccountingBookCalendar';
import AccountingRecords from '@/components/page/AccountingRecords';
import EditAccountingArea from '@/components/page/EditAccountingArea';
import { useState } from 'react';
export default function AccountingBookPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full">
      <div className="flex flex-row justify-center">
        <AccountingBookCalendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-4 shadow"
        />
        <AccountingRecords />
      </div>
      <div className="flex flex-row justify-center">
        <EditAccountingArea />
      </div>
    </div>
  );
}
