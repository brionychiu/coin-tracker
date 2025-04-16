'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useEffect, useState } from 'react';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface DateRangeTabsProps {
  value?: DateRange | null;
  onChange?: (range: DateRange) => void;
}
// TODO: value prop 目前沒有使用到，未來可以考慮加入
// 這個 prop 可以用來控制當前選中的日期範圍
// 例如可以用來顯示當前選中的月份或年份
export const DateRangeTabs = ({ value, onChange }: DateRangeTabsProps) => {
  const [tab, setTab] = useState<'month' | 'year' | 'recent'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  //計算日期區間並通知父層
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

    onChange?.({ startDate, endDate });
  }, [tab, currentDate, onChange]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) =>
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1),
    );
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) =>
      direction === 'prev' ? subYears(prev, 1) : addYears(prev, 1),
    );
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
          setTab(value as 'month' | 'year' | 'recent');
          setCurrentDate(new Date()); // 切換 tab 時重設日期
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
              variant="ghost"
              onClick={() => handleMonthChange('prev')}
            >
              &lt;
            </Button>
            <span>{getMonthTitle()}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleMonthChange('next')}
            >
              &gt;
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="year">
          <div className="flex items-center justify-center gap-4 pt-4 text-lg font-semibold">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleYearChange('prev')}
            >
              &lt;
            </Button>
            <span>{getYearTitle()}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleYearChange('next')}
            >
              &gt;
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="flex justify-center pt-4 text-lg font-semibold">
            <span>{getRecentRange()}</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
