import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { logoutUser } from '@/lib/api-client/auth';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, setUser } = useAuthStore();

  const logout = async () => {
    await logoutUser();
    Cookies.remove('authToken');
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
