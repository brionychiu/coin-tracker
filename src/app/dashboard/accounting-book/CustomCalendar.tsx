'use client';

import { zhTW } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/tailwindUtils';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  recordDates?: Date[]; // 新增記帳日期陣列
};

function CustomCalendar({
  className,
  classNames,
  showOutsideDays = true,
  recordDates = [],
  ...props
}: CalendarProps) {
  // 轉換記帳日期為 Set，加快查找效率
  const recordDatesSet = new Set(recordDates.map((d) => d.toDateString()));

  return (
    <DayPicker
      locale={zhTW}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-base font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'relative p-0 text-center text-base focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-10 w-10 p-0 font-normal aria-selected:opacity-100',
        ),
        day_selected:
          'bg-primary-02 text-primary-foreground hover:bg-primary-02 hover:text-primary-foreground focus:bg-primary-02 focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_hidden: 'invisible',
        ...classNames,
      }}
      modifiers={{
        hasRecord: (date) => recordDatesSet.has(date.toDateString()), // 自定義判斷是否為記帳日
      }}
      modifiersClassNames={{
        hasRecord:
          'after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-gray-02',
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

CustomCalendar.displayName = 'Calendar';

export { CustomCalendar };
