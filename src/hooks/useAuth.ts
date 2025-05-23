import { useRouter } from 'next/navigation';

import { logoutUser } from '@/lib/api-client/auth';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuthStore();

  const logout = async () => {
    await logoutUser();
    await fetch('/api/auth', { method: 'DELETE' });
    setUser(null);
    router.push('/');
  };

  return {
    user,
    uid: user?.uid ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
