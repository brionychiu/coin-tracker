"use client";

// import { useState } from "react";
import { registerUser } from "@/lib/firebase";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const FormSchema = z.object({
  email: z.string().email({ message: "請輸入正確格式電子信箱" }),
  password: z
    .string()
    .min(6, { message: "請輸入 6 位以上包含英數密碼" })
    .regex(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9\-_]{6,50}$/, {
      message: "輸入6位以上包含英數密碼",
    }),
});

export default function RegisterForm({
  toggleForm,
}: {
  toggleForm: () => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const userCredential = await registerUser(values.email, values.password);
      console.log("user", userCredential.user);
    } catch (error) {
      console.error("註冊錯誤", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="請輸入信箱" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="請輸入密碼"
                  maxLength={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">註冊</Button>
        <Button onClick={toggleForm}>已有帳號？請點擊登入</Button>
      </form>
    </Form>
  );
}
