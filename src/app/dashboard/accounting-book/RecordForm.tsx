'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
import {
  addAccountingRecord,
  updateAccountingRecord,
} from '@/lib/api/accounting';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryLabel,
} from '@/lib/categories';
import { handleNumericInput } from '@/lib/inputValidators';
import { extractFileName } from '@/lib/utils';
import { AccountingRecord } from '@/types/accounting';

interface RecordFormProps {
  date: Date | undefined;
  record: AccountingRecord | null;
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
  amount: z
    .string()
    .min(1, { message: '請輸入金額' })
    .regex(/^\d+$/, { message: '金額必須是正整數' })
    .refine((val) => parseInt(val, 10) > 0, { message: '金額必須大於 0' }),
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
  record,
  onCancel,
  onSave,
}: RecordFormProps) {
  const isEditMode = !!record;

  const defaultValues = useMemo(
    () => ({
      date: record ? new Date(record.date) : date || new Date(),
      amount: record?.amount ?? '',
      category: record
        ? getCategoryLabel(record.category)
        : (EXPENSE_CATEGORIES[0]?.label ?? ''),
      account: record?.account || 'cash',
      images: [],
      note: record?.note || '',
    }),
    [date, record],
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      console.log(isEditMode ? '更新中...' : '新增中...', data);

      const selectedCategory = [
        ...EXPENSE_CATEGORIES,
        ...INCOME_CATEGORIES,
      ].find((category) => category.label === data.category);

      if (!selectedCategory) {
        throw new Error('選擇的分類無效');
      }

      // 將選擇的 category label 轉換為對應的 category code
      const recordData = {
        ...data,
        category: selectedCategory.code,
        images: data.images || [],
      };

      if (isEditMode) {
        if (!record?.id) throw new Error('記錄 ID 缺失，無法更新');
        await updateAccountingRecord(record.id, recordData);
        toast.success('更新成功！');
        console.log('更新成功，ID:', record.id);
      } else {
        const docId = await addAccountingRecord(recordData);
        toast.success('新增成功！');
        console.log('新增成功，文件 ID:', docId);
      }

      form.reset();
      onSave();
    } catch (error: any) {
      console.error(isEditMode ? '更新失敗:' : '新增失敗:', error);
      toast.warning(
        `${isEditMode ? '更新' : '新增'}失敗:${error.message}，請稍後再試`,
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <h2 className="pb-2 text-center text-xl font-bold">
          {isEditMode ? '編輯' : '新增'}{' '}
          {date ? date.toLocaleDateString('zh-TW') : ''} 的記帳項目
        </h2>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>金額：</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="請輸入數字"
                    onKeyDown={handleNumericInput}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>帳戶：</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
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
        </div>
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
              {isEditMode && record?.images.length ? (
                <div className="mt-2">
                  <p className="text-sm font-medium">已上傳的圖片：</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {record.images.map((url, index) => (
                      <li key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {extractFileName(url)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2 animate-spin">⏳</span>{' '}
              {isEditMode ? '更新中...' : '儲存中...'}
            </>
          ) : isEditMode ? (
            '更新'
          ) : (
            '確認'
          )}
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </form>
    </Form>
  );
}
