'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { uid, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !uid)) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, uid, router]);

  if (isLoading || !isAuthenticated || !uid) return <FullscreenLoading />;

  return (
    <>
      <Navbar />
      <div className="flex w-full overflow-hidden pt-16">
        <main className="mx-3 my-10 w-full md:mx-6">{children}</main>
      </div>
    </>
  );
}
