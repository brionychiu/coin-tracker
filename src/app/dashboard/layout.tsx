'use client';

import { useEffect, useState } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import Navbar from '@/components/layout/Navbar';
import { auth, onAuthStateChanged } from '@/lib/firebase';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) return <FullscreenLoading />;
  if (!uid) return <div className="p-4">請先登入才能使用此功能</div>;

  return (
    <>
      <Navbar />
      <div className="flex w-full overflow-hidden pt-16">
        <main className="mx-3 my-10 w-full md:mx-6">{children}</main>
      </div>
    </>
  );
}
