import { create } from 'zustand';

import { auth, onAuthStateChanged, User } from '@/lib/firebase';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();

      await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } else {
      await fetch('/api/auth', { method: 'DELETE' });
    }

    set({ user, isLoading: false });
  });

  return {
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
  };
});
