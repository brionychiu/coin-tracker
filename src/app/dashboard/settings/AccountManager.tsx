'use client';

import { CirclePlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import AddAccountDialog from '@/components/modal/AddAccount';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirmModal';
import { deleteAccount, fetchVisibleAccounts } from '@/lib/api-client/account';
import { cn } from '@/lib/utils/tailwindUtils';
import { Account } from '@/types/account';

export default function AccountManager() {
  const { uid } = useAuth();
  const { confirm, ConfirmModal } = useConfirm();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectAccount, setSelectAccount] = useState<Account | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const result = await fetchVisibleAccounts();

      if (Array.isArray(result)) {
        setAccounts(result);
        if (result.length > 0) {
          setSelectAccount(result[0]);
        }
      } else {
        console.error('getVisibleAccounts error:', result);
      }
    } catch (err) {
      console.error('fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!uid) return;
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
      {loading ? (
        <LoadingSpinner message="正在載入帳戶..." />
      ) : (
        accounts.map((account: Account) => (
          <Button
            key={account.id}
            variant="ghost"
            disabled={loading}
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
        ))
      )}

      <div className="mt-6 flex items-center justify-end gap-4 sm:mt-0">
        <Button
          type="button"
          variant="iconHover"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
          disabled={loading}
        >
          <CirclePlus className="size-5" />
        </Button>
        <Button
          type="button"
          variant="iconHover"
          size="icon"
          onClick={handleDelete}
          disabled={loading || !selectAccount}
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
