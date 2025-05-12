'use client';

import { CirclePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getVisibleAccounts } from '@/app/api/accounts/route';
import AddAccountDialog from '@/components/modal/AddAccount';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirmModal';
import { deleteAccount } from '@/lib/api/account';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';

export default function AccountManager() {
  const { uid } = useAuth();
  const { confirm, ConfirmModal } = useConfirm();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectAccount, setSelectAccount] = useState<Account | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadAccounts = async () => {
    if (!uid) return;
    const result = await getVisibleAccounts(uid);

    if (Array.isArray(result)) {
      setAccounts(result);
      if (result.length > 0) {
        setSelectAccount(result[0]);
      }
    } else {
      console.error('getVisibleAccounts error:', result);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [uid]);

  const handleDelete = async () => {
    if (!selectAccount || !uid) return;

    confirm({
      title: '確認刪除',
      message: `確定要刪除「${selectAccount.label}」類別嗎？此操作無法復原。`,
      onConfirm: async () => {
        try {
          await deleteAccount({ uid, accountId: selectAccount.id });
          await loadAccounts();
          toast.success('刪除成功！');
        } catch (error) {
          console.error('刪除類別失敗', error);
          toast.error('刪除失敗，請稍後再試');
        }
      },
    });
  };

  return (
    <div className="rounded-md border p-2 shadow md:p-4">
      {accounts.map((account: Account) => (
        <Button
          key={account.id}
          variant="ghost"
          className={cn(
            selectAccount &&
              selectAccount.id === account.id &&
              'bg-primary-02 hover:bg-primary-02',
          )}
          onClick={() => {
            setSelectAccount(account);
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
          onClick={handleDelete}
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
      {ConfirmModal}
    </div>
  );
}
