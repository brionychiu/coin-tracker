import { onAuthStateChanged, User } from 'firebase/auth';
import Cookies from 'js-cookie';
import { create } from 'zustand';

import { auth } from '@/lib/firebase';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => {
  
  onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    Cookies.set('authToken', token, { expires: 180, secure: true });
    
  } else {
    Cookies.remove('authToken');
  }
  set({ user, isLoading: false });

  });

  return {
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
  };
});
