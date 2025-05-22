'use client';

import { onIdTokenChanged } from 'firebase/auth';
import { useEffect } from 'react';

import { auth } from '@/lib/firebase';

const sendTokenToServer = async (token: string) => {
  await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });
};

export function TokenRefresher() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await sendTokenToServer(token);
      }
    });

    const interval = setInterval(
      async () => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true); // 強制刷新 token
          await sendTokenToServer(token);
        }
      },
      1000 * 60 * 50,
    ); // 每 50 分鐘

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return null; // 不渲染任何畫面
}
