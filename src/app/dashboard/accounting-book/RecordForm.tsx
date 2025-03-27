'use client';

import TabsCategory from '@/components/tabs/TabsCategory';
import { Button } from '@/components/ui/button';
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
import { accountOptions } from '@/lib/accountOptions';
import { addAccountingRecord } from '@/lib/api/accounting';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface RecordFormProps {
  date: Date | undefined;
  onCancel: () => void;
  onSave: () => void;
}

const accountEnumValues = accountOptions.map((option) => option.value) as [
  string,
  ...string[],
];
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
  account: z.enum(accountEnumValues, {
    errorMap: () => ({ message: '請選擇一個帳戶' }),
  }),
  images: z
    .array(z.instanceof(File))
    .max(5, { message: '最多只能上傳 5 張圖片' })
    .optional(),
  note: z.string().max(500, { message: '最多只能輸入 500 個字' }).optional(),
});

export default function RecordForm({
  date,
  onCancel,
  onSave,
}: RecordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {
      date: date ? new Date(date) : new Date(),
      amount: '',
      category:
        EXPENSE_CATEGORIES.length > 0 ? EXPENSE_CATEGORIES[0].label : undefined,
      account: 'cash',
      images: [],
      note: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      console.log('新增中...', data);
      // 將選擇的 category label 轉換為對應的 category code
      const selectedCategory = [
        ...EXPENSE_CATEGORIES,
        ...INCOME_CATEGORIES,
      ].find((category) => category.label === data.category);

      if (!selectedCategory) {
        throw new Error('選擇的分類無效');
      }

      const recordData = { ...data, category: selectedCategory.code };
      const docId = await addAccountingRecord(recordData);

      toast.success('新增成功!');
      console.log('新增成功，文件 ID:', docId);
      form.reset();
      onSave();
    } catch (error: any) {
      console.error('新增失敗:', error);
      toast.warning(`新增失敗:${error.message}, 請稍後再試`);
    } finally {
      setIsLoading(false); // 結束載入動畫
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <h2 className="pb-2 text-center text-xl font-bold">
          新增 {date ? date.toLocaleDateString('zh-TW') : ''} 的記帳項目
        </h2>
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
                    {accountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2 animate-spin">⏳</span> 儲存中...
            </>
          ) : (
            '確認'
          )}
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </form>
    </Form>
  );
}
