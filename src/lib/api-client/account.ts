import { Account } from '@/types/account';

export async function fetchVisibleAccounts(): Promise<Account[]> {
  const res = await fetch('/api/accounts', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch accounts');
  }

  const data = await res.json();
  return data;
}
