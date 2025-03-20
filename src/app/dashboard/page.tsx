'use client';

import { DashboardCalendar } from '@/components/page/DashboardCalendar';
import TabsCategory from '@/components/page/TabsCategory';
import { useState } from 'react';
export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex w-full flex-row justify-center">
      <DashboardCalendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border p-4 shadow"
      />
      <TabsCategory />
    </div>
  );
}
