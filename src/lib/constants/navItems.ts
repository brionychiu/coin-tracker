import {
  BookOpenText,
  ChartNoAxesCombined,
  Search,
  Settings,
} from 'lucide-react';

export const navItems = [
  {
    title: '記帳本',
    url: '/dashboard/accounting-book',
    icon: BookOpenText,
  },
  {
    title: '圖表分析',
    url: '/dashboard/report',
    icon: ChartNoAxesCombined,
  },
  {
    title: '搜尋',
    url: '/dashboard/search',
    icon: Search,
  },
  {
    title: '設定',
    url: '/dashboard/settings',
    icon: Settings,
  },
];
