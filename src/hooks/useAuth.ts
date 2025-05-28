import { useRouter } from 'next/navigation';

import { logoutUser } from '@/lib/api-client/auth';
import { unsubscribeAll } from '@/lib/utils/firestore-unsubscribe';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuthStore();

  const logout = async () => {
    unsubscribeAll();
    setUser(null);

    await logoutUser();
    await fetch('/api/auth', { method: 'DELETE' });

    router.replace('/');
  };

  return {
    user,
    uid: user?.uid ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
