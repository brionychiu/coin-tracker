'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/lib/constants/navItems';

export default function DesktopNavbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  if (!isAuthenticated) return null;

  return (
    <div className="hidden sm:gap-1 md:flex lg:gap-4">
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
            <ActiveIcon size={18} className="hidden lg:inline-block" />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}
