'use client';

import { useState } from 'react';

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

import LoginForm from '../form/Login';
import RegisterForm from '../form/Register';

export default function AuthModal() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Button
          variant="link"
          className="text-base font-normal"
          onClick={logout}
        >
          登出
        </Button>
      ) : (
        <Dialog onOpenChange={(open) => open && setIsLoginView(true)}>
          <DialogTrigger>
            <span className="text-gray-01 underline-offset-4 hover:underline">
              登入/註冊
            </span>
          </DialogTrigger>
          <DialogContent className="w-350">
            <DialogHeader>
              <DialogTitle>{isLoginView ? '登入' : '註冊'}</DialogTitle>
              <DialogDescription></DialogDescription>
              {isLoginView ? (
                <LoginForm toggleForm={() => setIsLoginView(false)} />
              ) : (
                <RegisterForm toggleForm={() => setIsLoginView(true)} />
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
