'use client';

import { onIdTokenChanged } from 'firebase/auth';
import { useEffect, useRef } from 'react';

import { auth } from '@/lib/firebase';

const sendTokenToServer = async (token: string) => {
  try {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });
  } catch (err) {
    console.error('Failed to send token to server:', err);
  }
};

export function TokenRefresher() {
  const sendingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        if (sendingRef.current) return;
        sendingRef.current = true;

        try {
          const token = await user.getIdToken();
          await sendTokenToServer(token);
        } finally {
          sendingRef.current = false;
        }
      }
    });

    const interval = setInterval(
      async () => {
        const user = auth.currentUser;
        if (user) {
          if (sendingRef.current) return;
          sendingRef.current = true;

          try {
            const token = await user.getIdToken(true);
            await sendTokenToServer(token);
          } finally {
            sendingRef.current = false;
          }
        }
      },
      1000 * 60 * 50,
    );

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return null;
}
