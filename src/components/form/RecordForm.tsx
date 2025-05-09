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

import { getVisibleAccounts } from '@/app/api/accounts/route';
import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import CategoryTabs from '@/components/tabs/CategoryTabs';
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
import { Textarea } from '@/components/ui/textarea';
import { useAccountMap } from '@/hooks/useAccountMap';
import { useAuth } from '@/hooks/useAuth';
import { useCategoryMap } from '@/hooks/useCategoryMap';
import {
  addAccountingRecord,
  updateAccountingRecord,
} from '@/lib/api/accounting';
import { handleNumericInput } from '@/lib/inputValidators';
import { useDateStore } from '@/stores/dateStore';
import { Account } from '@/types/account';
import { AccountingRecord } from '@/types/accounting';

interface RecordFormProps {
  date: Date | undefined;
  record: AccountingRecord | null;
  onCancel: () => void;
  onSave: (updatedRecord?: AccountingRecord) => void;
}

const FormSchema = z.object({
  date: z.date({ required_error: '請選擇日期' }),
  amount: z
    .string()
    .min(1, { message: '請輸入金額' })
    .regex(/^[0-9]+$/, { message: '金額必須是正整數' })
    .refine((val) => parseInt(val, 10) > 0, { message: '金額必須大於 0' }),
  categoryId: z.string().min(1, { message: '請選擇類別' }),
  accountId: z.string().min(1, { message: '請選擇帳戶' }),
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
  const { uid } = useAuth();
  const { setDate } = useDateStore();
  const { categoryMap, loading } = useCategoryMap();
  const { accountMap, loading: accountMapLoading } = useAccountMap();

  const [imageList, setImageList] = useState<any[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDeletedAccount, setIsDeletedAccount] = useState(false);

  const loadAccounts = async () => {
    if (!uid) return;
    const result = await getVisibleAccounts(uid);

    if (Array.isArray(result)) {
      // 如果 record?.accountId 不在 result 中，則表示該帳戶已被刪除
      // 但仍然需要顯示在下拉選單中
      const deleted =
        !!record?.accountId &&
        !result.some((acc) => acc.id === record?.accountId);

      setIsDeletedAccount(deleted);
      setAccounts(result);
    } else {
      console.error('getVisibleAccounts error:', result);
    }
  };

  useEffect(() => {
    if (!uid || accountMapLoading) return;
    loadAccounts();
  }, [uid, accountMapLoading]);

  const defaultValues = useMemo(
    () => ({
      date: record ? new Date(record.date) : date || new Date(),
      amount: record?.amount ?? '',
      categoryId: record?.categoryId ?? '',
      accountId: record?.accountId || accounts[0]?.id || '',
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
    if (changedList.length > 5) {
      toast.error('最多只能上傳 5 張圖片');
      return;
    }

    setNewImages(files);
    setImageList(changedList);
    form.setValue('images', [
      ...imageList.filter((img) => !img.isOld).map((img) => img.file),
    ]);
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
    if (!uid) {
      toast.error('請先登入');
      return;
    }
    try {
      const recordData = {
        ...data,
        categoryId: data.categoryId,
        categoryType: categoryMap[data.categoryId].type,
        newImages,
        oldImages,
      };

      if (isEditMode) {
        if (!record?.id) throw new Error('缺少記錄 ID');
        const updated = await updateAccountingRecord(
          uid,
          record.id,
          recordData,
        );
        toast.success('更新成功');
        onSave(updated);
        setDate(new Date(data.date));
      } else {
        await addAccountingRecord(uid, recordData);
        toast.success('新增成功');
        onSave();
        setDate(new Date(data.date));
      }

      form.reset(defaultValues);
    } catch (error: any) {
      toast.error(`${isEditMode ? '更新' : '新增'}失敗：${error.message}`);
    }
  }

  return (
    <>
      {(isSubmitting || loading || accountMapLoading) && <FullscreenLoading />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:w-2/3"
        >
          <h2 className="pb-2 text-center text-xl font-bold">
            {isEditMode ? '編輯' : '新增'}{' '}
            {form.watch('date')?.toLocaleDateString('zh-TW') ?? ''} 的記帳項目
          </h2>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>日期：</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              name="accountId"
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
                        {accounts.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                        {isDeletedAccount && record?.accountId && (
                          <SelectItem value={record.accountId}>
                            <span className="text-gray-02">
                              {accountMap[record.accountId]?.label ||
                                '已刪除帳戶'}
                            </span>
                            <span className="ml-2 text-sm text-gray-02">
                              (已刪除)
                            </span>
                          </SelectItem>
                        )}
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>類別：</FormLabel>
                <FormControl>
                  <CategoryTabs
                    isEdit={false}
                    value={field.value}
                    onChange={field.onChange}
                    categoryId={isEditMode ? record?.categoryId : undefined}
                  />
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
                  <Textarea placeholder="寫點備註吧" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center md:justify-end">
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
