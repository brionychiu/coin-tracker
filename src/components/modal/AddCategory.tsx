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
import { addCategory } from '@/lib/api/categories';
import { iconMap, IconName } from '@/lib/iconMap';

const ICON_OPTIONS: IconName[] = Object.keys(iconMap) as IconName[];

interface AddCategoryDialogProps {
  open: boolean;
  type: 'expenses' | 'income';
  onOpenChange: (open: boolean) => void;
  onAddSuccess?: () => void;
}

export default function AddCategoryDialog({
  open,
  type,
  onOpenChange,
  onAddSuccess,
}: AddCategoryDialogProps) {
  const [label, setLabel] = useState('');
  const [selectedIconName, setSelectedIconName] = useState<IconName | null>(
    null,
  );
  const bgColor = type === 'expenses' ? 'bg-red-04' : 'bg-green-01';

  const handleSubmit = async () => {
    if (!label || !selectedIconName) return;

    try {
      const id = await addCategory({
        label,
        icon: selectedIconName,
        type,
      });
      toast.success('新增成功');

      onOpenChange(false);
      onAddSuccess?.();
    } catch (error) {
      console.error('新增類別失敗:', error);
      toast.error('新增失敗，請稍後再試');
    }
  };

  useEffect(() => {
    if (!open) {
      setLabel('');
      setSelectedIconName(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            新增{type === 'income' ? '收入' : '支出'}類別
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="輸入類別名稱"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={10}
          />

          <div className="grid max-h-[200px] grid-cols-6 gap-4 overflow-y-auto overflow-x-hidden">
            {ICON_OPTIONS.map((name, index) => {
              const Icon = iconMap[name];
              return (
                <Button
                  key={index}
                  variant="tabHover"
                  className="flex flex-col items-center gap-1"
                  type="button"
                  onClick={() => setSelectedIconName(name)}
                >
                  <span className="relative flex h-10 w-10 items-center justify-center">
                    {selectedIconName === name && (
                      <span
                        className={`absolute left-0 right-0 mx-auto h-8 w-8 rounded-full ${bgColor} opacity-80`}
                      />
                    )}
                    <Icon className="relative z-10 size-6" />
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={!label || !selectedIconName}>
            新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
