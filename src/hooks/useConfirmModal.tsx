import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
}

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = (opts: ConfirmOptions) => setOptions(opts);
  const close = () => setOptions(null);

  return {
    confirm,
    ConfirmModal: options
      ? createPortal(
          <Dialog open={!!options} onOpenChange={close}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{options.title}</DialogTitle>
              </DialogHeader>
              <p>{options.message}</p>
              <DialogFooter>
                <Button variant="outline" onClick={close}>
                  取消
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    options.onConfirm();
                    close();
                  }}
                >
                  確認
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>,
          document.body,
        )
      : null,
  };
}
