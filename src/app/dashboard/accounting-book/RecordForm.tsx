'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { toast } from 'sonner';
import { z } from 'zod';

import FullscreenLoading from '@/components/common/FullscreenLoading';
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
  getCategoryInfo,
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
  date: z.date({ required_error: '請選擇日期' }),
  amount: z
    .string()
    .min(1, { message: '請輸入金額' })
    .regex(/^[0-9]+$/, { message: '金額必須是正整數' })
    .refine((val) => parseInt(val, 10) > 0, { message: '金額必須大於 0' }),
  category: z.enum(categoryEnumValues),
  account: z.enum(accountEnumValues, {
    errorMap: () => ({ message: '請選擇一個帳戶' }),
  }),
  images: z.array(z.instanceof(File)).max(5).optional(),
  note: z.string().max(500).optional(),
});

export default function RecordForm({
  date,
  record,
  onCancel,
  onSave,
}: RecordFormProps) {
  const isEditMode = !!record;

  const [imageList, setImageList] = useState<any[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

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

  useEffect(() => {
    if (isEditMode && record?.images) {
      setOldImages(record.images);
      setImageList(record.images.map((url) => ({ dataURL: url, isOld: true })));
    }
  }, [isEditMode, record]);

  const onImageChange = (changedList: ImageListType) => {
    const files = changedList
      .filter((img) => !img.isOld && img.file)
      .map((img) => img.file) as File[];

    // 確保新照片加上舊照片不超過 5 張
    if (files.length + oldImages.length > 5) {
      toast.error('最多只能上傳 5 張圖片');
      return;
    }

    setNewImages(files);
    setImageList(changedList);
    form.setValue('images', files);
  };

  const handleImageRemove = (index: number) => {
    const removed = imageList[index];
    const newList = [...imageList];
    newList.splice(index, 1);
    setImageList(newList);

    if (removed.isOld && removed.dataURL) {
      setOldImages((prev) => prev.filter((url) => url !== removed.dataURL));
    }

    if (!removed.isOld && removed.file) {
      setNewImages((prev) => prev.filter((f) => f !== removed.file));
      form.setValue(
        'images',
        newImages.filter((f) => f !== removed.file),
      );
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const selectedCategory = [
        ...EXPENSE_CATEGORIES,
        ...INCOME_CATEGORIES,
      ].find((c) => c.label === data.category);
      if (!selectedCategory) throw new Error('分類錯誤');

      const { categoryType } = getCategoryInfo(selectedCategory.code);

      const recordData = {
        ...data,
        category: selectedCategory.code,
        categoryType,
        newImages,
        oldImages,
      };

      if (isEditMode) {
        if (!record?.id) throw new Error('缺少記錄 ID');
        await updateAccountingRecord(record.id, recordData);
        toast.success('更新成功');
      } else {
        await addAccountingRecord(recordData);
        toast.success('新增成功');
      }

      form.reset();
      onSave();
    } catch (error: any) {
      toast.error(`${isEditMode ? '更新' : '新增'}失敗：${error.message}`);
    }
  }

  return (
    <>
      {isSubmitting && <FullscreenLoading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
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
            render={() => (
              <FormItem>
                <FormLabel>收據照片（最多五張）：</FormLabel>
                <FormControl>
                  <ImageUploading
                    multiple
                    value={imageList}
                    onChange={onImageChange}
                  >
                    {({ imageList, onImageUpload }) => (
                      <div>
                        <Button type="button" onClick={onImageUpload}>
                          上傳圖片
                        </Button>
                        {imageList.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-4">
                            <PhotoProvider>
                              {imageList.map((image, index) => (
                                <div key={index} className="group relative">
                                  <PhotoView src={image.dataURL || ''}>
                                    <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded border">
                                      <Image
                                        src={image.dataURL || ''}
                                        alt={`收據照片 ${index + 1}`}
                                        sizes="(max-width: 600px) 100vw, 50vw"
                                        fill
                                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <Search className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  </PhotoView>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleImageRemove(index)}
                                    className="absolute right-0 top-0 z-20 flex translate-x-[50%] translate-y-[-50%] items-center justify-center rounded-full bg-red-500 hover:bg-red-600"
                                  >
                                    <CircleX size={16} />
                                  </Button>
                                </div>
                              ))}
                            </PhotoProvider>
                          </div>
                        )}
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
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={onCancel}
              className="mr-3 hover:bg-gray-01"
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {isEditMode ? '更新中...' : '儲存中...'}
                </>
              ) : isEditMode ? (
                '更新'
              ) : (
                '確認'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
