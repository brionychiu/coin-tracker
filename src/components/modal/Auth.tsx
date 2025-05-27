'use client';

import { useState } from 'react';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirmModal';

import LoginForm from '../form/Login';
import RegisterForm from '../form/Register';

export default function AuthModal() {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const { isAuthenticated, logout } = useAuth();
  const { confirm, ConfirmModal } = useConfirm();

  const handleLogout = async () => {
    confirm({
      title: '確認登出',
      message: '確定要登出嗎？',
      onConfirm: async () => {
        try {
          setLoadingMessage('登出中...');
          await logout();
        } catch (error) {
          console.error('登出失敗:', error);
        }
      },
    });
  };

  return (
    <>
      {!!loadingMessage && (
        <FullscreenLoading message={loadingMessage || '確認身份中'} />
      )}
      {isAuthenticated ? (
        <Button
          variant="link"
          className="text-base font-normal"
          onClick={handleLogout}
        >
          會員登出
        </Button>
      ) : (
        <Dialog onOpenChange={(open) => open && setIsLoginView(true)}>
          <DialogTrigger>
            <span className="text-gray-03 underline-offset-4 hover:underline">
              登入/註冊
            </span>
          </DialogTrigger>
          <DialogContent className="w-350">
            <DialogHeader>
              <DialogTitle>{isLoginView ? '登入' : '註冊'}</DialogTitle>
              <DialogDescription></DialogDescription>
              {isLoginView ? (
                <LoginForm
                  toggleForm={() => setIsLoginView(false)}
                  onLoadingChange={(loading) => {
                    if (loading) {
                      setLoadingMessage('登入中...');
                    }
                  }}
                />
              ) : (
                <RegisterForm toggleForm={() => setIsLoginView(true)} />
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      {ConfirmModal}
    </>
  );
}
