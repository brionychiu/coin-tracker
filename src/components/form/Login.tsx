'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { signIn } from '@/lib/api-client/auth';

const FormSchema = z.object({
  email: z.string().email({ message: '請輸入正確格式電子信箱' }),
  password: z
    .string()
    .min(6, { message: '請輸入 6 位以上包含英數密碼' })
    .regex(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9\-_]{6,50}$/, {
      message: '輸入6位以上包含英數密碼',
    }),
});

export default function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const TEST_EMAIL = process.env.NEXT_PUBLIC_TEST_EMAIL || '';
  const TEST_PASSWORD = process.env.NEXT_PUBLIC_TEST_PASSWORD || '';

  const handleTestLogin = () => {
    form.setValue('email', TEST_EMAIL);
    form.setValue('password', TEST_PASSWORD);
  };

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signIn(values.email, values.password);
      if (userCredential) {
        router.push('/dashboard/accounting-book');
      }
    } catch (error) {
      console.error('登入失敗:', error);
    } finally {
      setIsLoading(false);
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '登入中...' : '登入'}
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
