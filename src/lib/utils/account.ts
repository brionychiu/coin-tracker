import { Account } from '@/types/account';

export const getAccountLabelById = (
  accountId: string,
  accountMap: Record<string, Account>,
): string => {
  const account = accountMap[accountId];
  if (!account) return '未知帳戶';

  return account.label;
};
