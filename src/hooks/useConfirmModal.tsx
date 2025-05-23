import { useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
            <DialogContent className="justify-center justify-items-center">
              <DialogHeader>
                <DialogTitle>{options.title}</DialogTitle>
              </DialogHeader>
              <p>{options.message}</p>
              <DialogFooter>
                <div className="flex justify-center gap-4">
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
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>,
          document.body,
        )
      : null,
  };
}
