import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { registerUser } from '@/lib/api-client/auth';

const FormSchema = z
  .object({
    email: z.string().email({ message: '請輸入正確格式電子信箱' }),
    password: z
      .string()
      .min(6, { message: '請輸入 6 位以上包含英數密碼' })
      .regex(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9\-_]{6,50}$/, {
        message: '輸入6位以上包含英數密碼',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密碼不相符',
    path: ['confirmPassword'],
  });

export default function RegisterForm({
  toggleForm,
}: {
  toggleForm: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await registerUser(values.email, values.password);
      console.log('user', userCredential.user);
      toast.success('註冊成功，歡迎使用');
    } catch (error: any) {
      console.error('註冊錯誤', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('此信箱已被註冊');
      } else {
        toast.error('註冊失敗，請稍後再試');
      }
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="請再次確認密碼"
                  maxLength={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '註冊中...' : '註冊'}
        </Button>
        <Button variant="link" onClick={toggleForm}>
          已有帳號？請點擊登入
        </Button>
      </form>
    </Form>
  );
}
