'use client';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { uid, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <FullscreenLoading />;
  if (!isAuthenticated || !uid)
    return <div className="p-4">請先登入才能使用此功能</div>;

  return (
    <>
      <Navbar />
      <div className="flex w-full overflow-hidden pt-16">
        <main className="mx-3 my-10 w-full md:mx-6">{children}</main>
      </div>
    </>
  );
}
