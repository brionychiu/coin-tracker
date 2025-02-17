"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import LoginForm from "../form/Login";
import RegisterForm from "../form/Register";

export default function AuthModal() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Button onClick={logout}>登出</Button>
      ) : (
        <Dialog>
          <DialogTrigger>會員登入/註冊</DialogTrigger>
          <DialogContent className="w-350">
            <DialogHeader>
              <DialogTitle>{isLoginView ? "登入" : "註冊"}</DialogTitle>
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
