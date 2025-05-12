'use client';

import { getVisibleAccounts } from '@/app/api/accounts/route';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Account } from '@/types/account';
import { useEffect, useState } from 'react';

interface AccountSelectProps {
  value: string;
  accountMap: Record<string, Account>;
  accountId?: string; // edit record?.accountId
  onChange: (value: string) => void;
}

export function AccountSelect({
  value,
  accountMap,
  accountId,
  onChange,
}: AccountSelectProps) {
  const { uid } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDeletedAccount, setIsDeletedAccount] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const fetchAccounts = async () => {
      const result = await getVisibleAccounts(uid);
      if (Array.isArray(result)) {
        // 如果 record?.accountId 不在 result 中，則表示該帳戶已被刪除
        // 但仍然需要顯示在下拉選單中
        const deleted =
          !!accountId && !result.some((acc) => acc.id === accountId);
        setIsDeletedAccount(deleted);
        setAccounts(result);
      } else {
        console.error('getVisibleAccounts error:', result);
      }
    };
    fetchAccounts();
  }, [uid, accountId]);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="請選擇帳戶" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.label}
          </SelectItem>
        ))}
        {isDeletedAccount && accountId && (
          <SelectItem value={accountId}>
            <span className="text-gray-02">
              {accountMap[accountId]?.label || '已刪除帳戶'}
            </span>
            <span className="ml-2 text-sm text-gray-02">(已刪除)</span>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
