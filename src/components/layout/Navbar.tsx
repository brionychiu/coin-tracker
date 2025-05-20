'use client';

import Image from 'next/image';
import Link from 'next/link';

import AuthModal from '@/components/modal/Auth';
import { useAuth } from '@/hooks/useAuth';

import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-muted shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <MobileNavbar isAuthenticated={isAuthenticated} />

          <Link href="/" className="flex items-center">
            <div className="px-2">
              <Image
                className="h-10 w-10 rounded-md md:h-12 md:w-12"
                src="/logo.png"
                alt="Logo Icon"
                width={50}
                height={50}
                priority
              />
            </div>
            <div className="ml-2 hidden flex-col md:flex">
              <span className="text-base font-bold">開心記帳</span>
              <span className="text-xs">輕鬆掌握生活收支</span>
            </div>
          </Link>
        </div>

        <DesktopNavbar isAuthenticated={isAuthenticated} />

        <div className="flex items-center gap-3 md:gap-4">
          {isAuthenticated && user && (
            <span className="hidden max-w-[120px] truncate text-base font-normal text-gray-03 mobile:block md:max-w-[200px]">
              {user.email}
            </span>
          )}
          <AuthModal />
        </div>
      </div>
    </nav>
  );
}
