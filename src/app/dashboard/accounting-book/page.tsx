'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CustomCalendar } from '@/app/dashboard/accounting-book/CustomCalendar';
import Records from '@/app/dashboard/accounting-book/Records';
import { Button } from '@/components/ui/button';
import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { useDateStore } from '@/stores/dateStore';

export default function AccountingBookPage() {
  const router = useRouter();
  const { date, setDate } = useDateStore();
  const month = date ? date.getMonth() : new Date().getMonth();

  const { records } = useAccountingRecords(date, month);
  const recordDates = records.map((record) => new Date(record.date));

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleEdit = (recordId: string) => {
    router.push(`/dashboard/accounting-book/form/${recordId}`);
  };

  const handleCreate = () => {
    router.push('/dashboard/accounting-book/form/new');
  };

  return (
    <div className="mx-auto h-full w-full max-w-6xl bg-white">
      <div className="flex-row gap-6 md:flex">
        <div className="flex flex-col items-center justify-self-center md:justify-self-start lg:w-96">
          <CustomCalendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            month={date}
            onMonthChange={handleMonthChange}
            recordDates={recordDates}
            className="md:p-4"
          />
          <Button onClick={handleCreate} className="my-5">
            <Plus />
            新增記帳
          </Button>
        </div>
        <div className="md:flex-1">
          <Records
            date={date}
            month={month}
            onEdit={(record) => handleEdit(record.id)}
          />
        </div>
      </div>
    </div>
  );
}
