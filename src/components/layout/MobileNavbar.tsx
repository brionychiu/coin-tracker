'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/lib/constants/navItems';

export default function MobileNavbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (url: string) => pathname === url;

  if (!isAuthenticated) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
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
  );
}
