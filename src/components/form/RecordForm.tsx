'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { toast } from 'sonner';
import { z } from 'zod';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { AccountSelect } from '@/components/select/AccountSelect';
import { CurrencySelect } from '@/components/select/CurrencySelect';
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
import { Textarea } from '@/components/ui/textarea';
import { useAccountMap } from '@/hooks/useAccountMap';
import { useAuth } from '@/hooks/useAuth';
import { useCategoryMap } from '@/hooks/useCategoryMap';
import { fetchVisibleAccounts } from '@/lib/api-client/account';
import {
  addAccountingRecord,
  updateAccountingRecord,
} from '@/lib/api-client/accounting';
import { getEffectiveYearMonth } from '@/lib/utils/date';
import { handleNumericInput, parseCurrencyValue } from '@/lib/utils/input';
import { useDateStore } from '@/stores/dateStore';
import { useExchangeRateStore } from '@/stores/exchangeRateStore';
import { Account } from '@/types/account';
import { AccountingRecord } from '@/types/accounting';
import { ExchangeRateMonthly } from '@/types/exchange-rate';

interface RecordFormProps {
  date: Date | undefined;
  record: AccountingRecord | null;
  onCancel: () => void;
  onSave: (updatedRecord?: AccountingRecord) => void;
}

const FormSchema = z.object({
  date: z.date({ required_error: '請選擇日期' }),
  accountId: z.string().min(1, { message: '請選擇帳戶' }),
  amount: z
    .string()
    .min(1, { message: '請輸入金額' })
    .regex(/^[0-9]+$/, { message: '金額必須是正整數' })
    .refine((val) => parseInt(val, 10) > 0, { message: '金額必須大於 0' }),
  currency: z.string().min(1, { message: '請選擇幣別' }),
  categoryId: z.string().min(1, { message: '請選擇類別' }),
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
  const { loading: isExchangeLoading } = useExchangeRateStore();

  const [imageList, setImageList] = useState<any[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [exchangeRateData, setExchangeRateData] =
    useState<ExchangeRateMonthly | null>(null);

  const loadAccounts = async () => {
    try {
      const result = await fetchVisibleAccounts();
      setAccounts(result);
    } catch (error) {
      console.error('getVisibleAccounts error:', error);
    }
  };

  useEffect(() => {
    if (!uid || accountMapLoading) return;
    loadAccounts();
  }, [uid, accountMapLoading]);

  const defaultValues = useMemo(
    () => ({
      createAt: new Date().toISOString(),
      date: record ? new Date(record.date) : date || new Date(),
      accountId: record?.accountId || accounts[0]?.id || '',
      amount: record?.amount ?? '',
      currency: record?.currency || 'Common-TWD',
      categoryId: record?.categoryId ?? '',
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

  const formDate = useWatch({
    control: form.control,
    name: 'date',
  });

  useEffect(() => {
    if (!formDate) return;
    const yearMonth = getEffectiveYearMonth(formDate);

    const fetchRate = async () => {
      try {
        const result = await useExchangeRateStore
          .getState()
          .ensureRate(yearMonth);
        if (!result) {
          console.error('匯率取得失敗');
        }
        setExchangeRateData(result);
      } catch (error) {
        console.error('匯率取得失敗', error);
      }
    };

    fetchRate();
  }, [formDate]);

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
    if (!exchangeRateData) {
      toast.error('尚未取得匯率，請稍候再試');
      return;
    }
    const currencyValue = parseCurrencyValue(data.currency).value;
    const quoteKey = `TWD${currencyValue}`;

    try {
      const recordData = {
        ...data,
        createAt: new Date().toISOString(),
        exchangeRate: exchangeRateData?.quotes[quoteKey] || 1,
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
      {(isExchangeLoading || isSubmitting || loading || accountMapLoading) && (
        <FullscreenLoading />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:w-2/3"
        >
          <h2 className="pb-2 text-center text-xl font-bold">
            {isEditMode ? '編輯' : '新增'}{' '}
            {form.watch('date')?.toLocaleDateString('zh-TW') ?? ''} 的記帳項目
          </h2>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-1/2">
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
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>帳戶：</FormLabel>
                  <FormControl>
                    <AccountSelect
                      value={field.value}
                      onChange={field.onChange}
                      accountId={record?.accountId}
                      accountMap={accountMap}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
              name="currency"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>貨幣：</FormLabel>
                  <FormControl>
                    <CurrencySelect
                      value={field.value}
                      onChange={field.onChange}
                    />
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
