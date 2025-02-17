"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

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

export default function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleTestLogin = () => {
    form.setValue("email", "test@mail.com");
    form.setValue("password", "abc1234");
  };

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      console.error("登入失敗", result.error);
      toast.error("登入失敗，請輸入正確信箱或密碼");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <div>
          <Button type="submit" className="w-full">
            登入
          </Button>
          <Button variant="link" onClick={toggleForm} className="mt-2">
            沒有帳號？請點擊註冊
          </Button>
          <Button variant="link" onClick={handleTestLogin} className="mt-2">
            使用測試帳號登入
          </Button>
        </div>
      </form>
    </Form>
  );
}
