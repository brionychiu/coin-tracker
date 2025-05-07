'use client';

import { CirclePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getVisibleAccounts } from '@/app/api/accounts/route';
import AddAccountDialog from '@/components/modal/AddAccount';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';

export default function AccountManager() {
  const { uid } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectAccount, setSelectAccount] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadAccounts = async () => {
    if (!uid) return;
    const result = await getVisibleAccounts(uid);

    if (Array.isArray(result)) {
      setAccounts(result);
      if (result.length > 0) {
        setSelectAccount(result[0].id);
      }
    } else {
      console.error('getVisibleAccounts error:', result);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [uid]);

  return (
    <div className="rounded-md border p-2 shadow md:p-4">
      {accounts.map((account: Account) => (
        <Button
          key={account.id}
          variant="ghost"
          className={cn(
            selectAccount === account.id && 'bg-primary-02 hover:bg-primary-02',
          )}
          onClick={() => {
            setSelectAccount(account.id);
          }}
        >
          {account.label}
        </Button>
      ))}
      <div className="mt-6 flex items-center justify-end gap-4 sm:mt-0">
        <Button
          type="button"
          variant="iconHover"
          size="icon"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          <CirclePlus className="size-5" />
        </Button>
        <Button
          type="button"
          variant="iconHover"
          size="icon"
          // onClick={handleDelete}
          onClick={() => {
            console.log('Account clicked:', '刪除帳戶', selectAccount);
          }}
        >
          <Trash2 className="size-5" />
        </Button>
      </div>
      <AddAccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSuccess={() => {
          setIsDialogOpen(false);
          loadAccounts();
        }}
      />
    </div>
  );
}
