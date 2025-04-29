'use client';

import {
  BookOpenText,
  ChartNoAxesCombined,
  Menu,
  Search,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import icon from '@/assets/images/icon.png';
import AuthModal from '@/components/modal/Auth';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
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

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (url: string) => pathname === url;

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-muted shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo 區 */}
        <Link href="/" className="flex items-center">
          <div className="px-2">
            <Image
              className="rounded-md"
              src={icon}
              alt="Logo Icon"
              width={32}
              height={40}
              priority
            />
          </div>
          <div className="ml-2 hidden flex-col sm:flex">
            <span className="text-base font-bold">開心記帳</span>
            <span className="text-xs">輕鬆掌握生活收支</span>
          </div>
        </Link>

        {/* Desktop 導覽列 */}
        <div className="hidden gap-4 sm:flex">
          {navItems.map((item) => {
            const ActiveIcon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-primary ${
                  isActive(item.url)
                    ? 'font-semibold text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <ActiveIcon size={18} />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* RWD 漢堡選單 + 登入 */}
        <div className="flex items-center gap-3 sm:gap-4">
          <AuthModal />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mb-4 flex items-center justify-between">
                <DialogTitle className="text-lg font-bold">選單</DialogTitle>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const ActiveIcon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground ${
                        isActive(item.url)
                          ? 'bg-accent font-semibold text-accent-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <ActiveIcon size={18} />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
