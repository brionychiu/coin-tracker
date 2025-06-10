'use client';

import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CustomCalendar } from '@/app/dashboard/accounting-book/CustomCalendar';
import Records from '@/app/dashboard/accounting-book/Records';
import { Button } from '@/components/ui/button';
import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { useDateStore } from '@/stores/dateStore';

export default function AccountingBookPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { date, setDate } = useDateStore();

  const { records } = useAccountingRecords(date);
  const recordDates = records.map((record) => new Date(record.date));

  const handleMonthChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleEdit = (recordId: string) => {
    router.push(`/dashboard/accounting-book/form/${recordId}`);
  };

  const handleCreate = () => {
    setIsLoading(true);
    router.push('/dashboard/accounting-book/form/new');
  };

  useEffect(() => {
    router.prefetch('/dashboard/accounting-book/form/new');
  }, []);

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
          <Button
            onClick={handleCreate}
            disabled={isLoading}
            className="my-5 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                載入中...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                新增記帳
              </>
            )}
          </Button>
        </div>
        <div className="md:flex-1">
          <Records date={date} onEdit={(record) => handleEdit(record.id)} />
        </div>
      </div>
    </div>
  );
}
