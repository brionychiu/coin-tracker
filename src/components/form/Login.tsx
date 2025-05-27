'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
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
import { signIn, signInWithGoogle } from '@/lib/api-client/auth';

const FormSchema = z.object({
  email: z.string().email({ message: '請輸入正確格式電子信箱' }),
  password: z
    .string()
    .min(6, { message: '請輸入 6 位以上包含英數密碼' })
    .regex(/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9\-_]{6,50}$/, {
      message: '輸入6位以上包含英數密碼',
    }),
});

interface LoginFormProps {
  toggleForm: () => void;
  onLoadingChange: (loading: boolean) => void;
  onSuccess: () => void;
}

export default function LoginForm({
  toggleForm,
  onLoadingChange,
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();

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
    onLoadingChange(true);
    try {
      const userCredential = await signIn(values.email, values.password);
      if (userCredential) {
        onSuccess();
        router.push('/dashboard/accounting-book');
      }
    } catch (error) {
      console.error('登入失敗:', error);
    } finally {
      onLoadingChange(false);
    }
  }

  const handleGoogleSignIn = async () => {
    onLoadingChange(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onSuccess();
        router.push('/dashboard/accounting-book');
      }
    } catch (error) {
      console.error('Google 登入失敗:', error);
    } finally {
      onLoadingChange(false);
    }
  };

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
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? '登入中...' : '登入'}
          </Button>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handleTestLogin}
            disabled={form.formState.isSubmitting}
          >
            使用測試帳號登入
          </Button>
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="mt-4 w-full"
            disabled={form.formState.isSubmitting}
          >
            <FcGoogle className="text-xl" />
            使用 Google 登入
          </Button>
          <Button variant="link" onClick={toggleForm} className="mt-2">
            沒有帳號？請點擊註冊
          </Button>
        </div>
      </form>
    </Form>
  );
}
