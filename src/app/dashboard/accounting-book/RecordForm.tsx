'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUploading, { ImageListType } from 'react-images-uploading';
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
  const [images, setImages] = useState<any[]>([]);

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

  const onImageChange = (imageList: ImageListType) => {
    // 提取 file 屬性並設置給表單
    const files = imageList
      .map((image) => image.file)
      .filter(Boolean) as File[];
    console.log(files);
    setImages(imageList); // 儲存整個 imageList 以便顯示預覽
    form.setValue('images', files); // 傳遞 file 陣列到表單
  };

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
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onImageChange}
                  maxNumber={5}
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div>
                      <Button
                        type="button"
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        上傳圖片
                      </Button>
                      <div className="mt-4 flex flex-row flex-wrap gap-4">
                        {imageList.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.dataURL}
                              alt=""
                              width="100"
                              className="h-24 w-24 rounded border object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => onImageRemove(index)}
                              className="absolute right-0 top-0 flex translate-x-[50%] translate-y-[-50%] items-center justify-center rounded-full bg-red-500 hover:bg-red-600"
                            >
                              <CircleX size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
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
