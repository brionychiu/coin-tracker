'use client';

import {
  addMonths,
  addYears,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface DateRangeTabsProps {
  tab: 'month' | 'year' | 'recent';
  currentDate: Date;
  onTabChange: (tab: 'month' | 'year' | 'recent') => void;
  onDateChange: (date: Date) => void;
  onRangeChange: (range: DateRange) => void;
}

export const DateRangeTabs = ({
  tab,
  currentDate,
  onTabChange,
  onDateChange,
  onRangeChange,
}: DateRangeTabsProps) => {
  useEffect(() => {
    let startDate: Date;
    let endDate: Date;

    if (tab === 'month') {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
    } else if (tab === 'year') {
      startDate = startOfYear(currentDate);
      endDate = endOfYear(currentDate);
    } else {
      endDate = startOfDay(new Date());
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
    }

    onRangeChange({ startDate, endDate });
  }, [tab, currentDate, onRangeChange]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate =
      direction === 'prev'
        ? subMonths(currentDate, 1)
        : addMonths(currentDate, 1);
    onDateChange(newDate);
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    const newDate =
      direction === 'prev'
        ? subYears(currentDate, 1)
        : addYears(currentDate, 1);
    onDateChange(newDate);
  };

  const getMonthTitle = () =>
    format(currentDate, 'yyyy 年 M 月', { locale: zhTW });
  const getYearTitle = () => format(currentDate, 'yyyy 年', { locale: zhTW });
  const getRecentRange = () => {
    const end = startOfDay(new Date());
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return `${format(start, 'M 月 d 日', { locale: zhTW })} ～ ${format(end, 'M 月 d 日', { locale: zhTW })}`;
  };

  return (
    <div>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          onTabChange(value as 'month' | 'year' | 'recent');
          onDateChange(new Date());
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="month">月</TabsTrigger>
          <TabsTrigger value="year">年</TabsTrigger>
          <TabsTrigger value="recent">最近七天</TabsTrigger>
        </TabsList>

        <TabsContent value="month">
          <div className="flex items-center justify-center gap-4 py-4 text-lg font-semibold">
            <Button
              size="icon"
              variant="iconHover"
              onClick={() => handleMonthChange('prev')}
            >
              &lt;
            </Button>
            <span>{getMonthTitle()}</span>
            <Button
              size="icon"
              variant="iconHover"
              onClick={() => handleMonthChange('next')}
            >
              &gt;
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="year">
          <div className="flex items-center justify-center gap-4 py-4 text-lg font-semibold">
            <Button
              size="icon"
              variant="iconHover"
              onClick={() => handleYearChange('prev')}
            >
              &lt;
            </Button>
            <span>{getYearTitle()}</span>
            <Button
              size="icon"
              variant="iconHover"
              onClick={() => handleYearChange('next')}
            >
              &gt;
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="flex justify-center py-4 text-lg font-semibold">
            <span>{getRecentRange()}</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
