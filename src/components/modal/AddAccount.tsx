'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { addAccount } from '@/lib/api/account';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSuccess?: () => void;
}

export default function AddAccountDialog({
  open,
  onOpenChange,
  onAddSuccess,
}: AddAccountDialogProps) {
  const { uid } = useAuth();
  const [label, setLabel] = useState('');

  const handleSubmit = async () => {
    if (!label || !uid) return;
    try {
      await addAccount({
        uid,
        label,
      });
      toast.success('新增成功');
      onOpenChange(false);
      onAddSuccess?.();
    } catch (error) {
      console.error('新增帳戶失敗:', error);
      toast.error('新增失敗，請稍後再試');
    }
  };

  useEffect(() => {
    if (!open) {
      setLabel('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增帳戶</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="輸入類別名稱"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={10}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={!label}>
            新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
