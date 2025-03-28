import { logoutUser } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import Cookies from 'js-cookie';

export function useAuth() {
  const { user, isLoading, setUser } = useAuthStore();

  const logout = async () => {
    await logoutUser();
    Cookies.remove('authToken');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
