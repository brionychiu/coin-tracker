import { PackageOpen, Pencil, Search, Trash2 } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { toast } from 'sonner';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { Button } from '@/components/ui/button';
import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { useAccountMap } from '@/hooks/useAccountMap';
import { useCategoryMap } from '@/hooks/useCategoryMap';
import { useConfirm } from '@/hooks/useConfirmModal';
import { deleteAccountingRecord } from '@/lib/api-client/accounting';
import { getAccountLabelById } from '@/lib/utils/account';
import {
  getCategoryIconById,
  getCategoryLabelById,
} from '@/lib/utils/categories';
import { getCurrencyLabel } from '@/lib/utils/input';
import { AccountingRecord } from '@/types/accounting';

interface RecordsProps {
  date: Date | undefined;
  onEdit: (record: AccountingRecord) => void;
}

export default function Records({ date, onEdit }: RecordsProps) {
  const { filteredRecords, loading } = useAccountingRecords(date);
  const { confirm, ConfirmModal } = useConfirm();
  const { categoryMap } = useCategoryMap();
  const { accountMap } = useAccountMap();

  const handleDelete = async (record: AccountingRecord) => {
    confirm({
      title: '確認刪除',
      message: '確定要刪除此記錄嗎？此操作無法復原。',
      onConfirm: async () => {
        try {
          await deleteAccountingRecord(record.id);
          toast.success('刪除成功！');
        } catch (error) {
          console.error('刪除失敗:', error);
          toast.error('刪除失敗，請稍後再試');
        }
      },
    });
  };

  return (
    <div className="rounded-2xl">
      {loading ? (
        <FullscreenLoading />
      ) : (
        <>
          <ul className="mt-4 space-y-4">
            <h2 className="pb-2 text-center text-xl font-bold">
              {date ? date.toLocaleDateString('zh-TW') : ''} 的記帳項目
            </h2>

            {filteredRecords.length === 0 ? (
              <p className="mt-5 flex items-center justify-center gap-2 text-muted-foreground">
                <PackageOpen className="h-5 w-5" />
                本日無記帳紀錄
              </p>
            ) : (
              <>
                {filteredRecords.map((record) => (
                  <li
                    key={record.id}
                    className="group rounded-2xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-8 w-8 flex-none items-center justify-center">
                        <span
                          className={`absolute h-5 w-5 rounded-full opacity-80 ${
                            record.categoryType === 'income'
                              ? 'bg-green-01'
                              : 'bg-red-04'
                          }`}
                        />
                        <div className="relative z-10 text-2xl">
                          {getCategoryIconById(record.categoryId, categoryMap)}
                        </div>
                      </div>
                      <div className="grow space-y-2">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {getCategoryLabelById(
                              record.categoryId,
                              categoryMap,
                            )}
                          </p>
                          <p className="text-lg font-semibold">
                            <span className="text-lg font-bold">
                              {record.amount}
                            </span>
                            <span className="ml-1 break-keep text-sm font-bold">
                              {getCurrencyLabel(record.currency)}
                            </span>
                          </p>
                        </div>
                        <p className="break-keep text-muted-foreground">
                          {getAccountLabelById(record.accountId, accountMap)}
                        </p>
                        {record.note && (
                          <p className="text-sm text-muted-foreground">
                            備註：{record.note}
                          </p>
                        )}
                        <PhotoProvider>
                          {record.images?.length > 0 && (
                            <figure className="flex flex-wrap gap-4">
                              {record.images.map((url, index) => (
                                <div key={index} className="relative">
                                  <PhotoView src={url}>
                                    <div className="relative h-10 w-10 cursor-pointer overflow-hidden rounded sm:h-16 sm:w-16">
                                      <img
                                        src={url}
                                        alt={`收據照片 ${index + 1}`}
                                        className="object-cover transition-transform duration-200 hover:scale-105"
                                      />
                                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
                                        <Search className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  </PhotoView>
                                </div>
                              ))}
                            </figure>
                          )}
                        </PhotoProvider>
                        <div className="mt-2 flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="iconHover"
                            size="icon"
                            onClick={() => onEdit(record)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="iconHover"
                            size="icon"
                            onClick={() => handleDelete(record)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            )}
          </ul>
          {ConfirmModal}
        </>
      )}
    </div>
  );
}
