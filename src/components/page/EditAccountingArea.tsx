'use client';

import TabsCategory from '@/components/page/TabsCategory';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';

import { addAccountingRecord } from '@/lib/api/accounting';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const categoryEnumValues = [
  ...EXPENSE_CATEGORIES.map((c) => c.label),
  ...INCOME_CATEGORIES.map((c) => c.label),
] as [string, ...string[]];

const FormSchema = z.object({
  date: z.date({
    required_error: '請選擇日期',
  }),
  amount: z.string().min(1, {
    message: '請輸入正整數',
  }),
  category: z.enum(categoryEnumValues),
  account: z.enum(['cash', 'bank', 'credit'], {
    errorMap: () => ({ message: '請選擇一個帳戶' }),
  }),
  images: z
    .array(z.instanceof(File))
    .max(5, { message: '最多只能上傳 5 張圖片' })
    .optional(),
  note: z.string().max(500, { message: '最多只能輸入 500 個字' }).optional(),
});

export default function EditAccountingArea() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: new Date(),
      amount: '',
      category:
        EXPENSE_CATEGORIES.length > 0 ? EXPENSE_CATEGORIES[0].label : undefined,
      account: 'cash',
      images: [],
      note: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log('新增中...', data);
      const docId = await addAccountingRecord(data);
      console.log('新增成功，文件 ID:', docId);
    } catch (error) {
      console.error('新增失敗:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>日期：</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>金額：</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="請輸入數字"
                  min={1}
                  step={1}
                  onKeyDown={(e) => {
                    if (['e', 'E', '-', '.'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>類別：</FormLabel>
              <FormControl>
                <TabsCategory value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>帳戶：</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="請選擇帳戶" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">現金</SelectItem>
                    <SelectItem value="bank">銀行</SelectItem>
                    <SelectItem value="credit">信用卡</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>收據照片（最多五張）：</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    field.onChange(files);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>寫點備註吧：</FormLabel>
              <FormControl>
                <Input type="text" placeholder="寫點備註吧" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">儲存</Button>
      </form>
    </Form>
  );
}
