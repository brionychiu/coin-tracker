import { PackageOpen, Pencil, Search, Trash2 } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { toast } from 'sonner';

import { FullscreenLoading } from '@/components/common/FullscreenLoading';
import { Button } from '@/components/ui/button';
import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { useConfirm } from '@/hooks/useConfirmModal';
import { getAccountLabel } from '@/lib/account';
import { deleteAccountingRecord } from '@/lib/api/accounting';
import { getCategoryIcon, getCategoryInfo } from '@/lib/categories';
import { AccountingRecord } from '@/types/accounting';

interface RecordsProps {
  date: Date | undefined;
  month: number;
  onEdit: (record: AccountingRecord) => void;
}

export default function Records({ date, month, onEdit }: RecordsProps) {
  const { filteredRecords, loading } = useAccountingRecords(date, month);
  const { confirm, ConfirmModal } = useConfirm();

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
              <p className="flex items-center justify-center gap-2 text-muted-foreground">
                <PackageOpen className="h-5 w-5" />
                本日無記帳紀錄
              </p>
            ) : (
              <PhotoProvider>
                {filteredRecords.map((record) => (
                  <li
                    key={record.id}
                    className="group rounded-2xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div className="relative flex h-8 w-8 items-center justify-center">
                          <span
                            className={`absolute h-5 w-5 rounded-full opacity-80 ${
                              record.categoryType === 'income'
                                ? 'bg-green-01'
                                : 'bg-primary-03'
                            }`}
                          />
                          <div className="relative z-10 text-2xl">
                            {getCategoryIcon(record.category)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">
                            {getCategoryInfo(record.category).label}
                          </p>
                          {record.note && (
                            <p className="text-sm text-muted-foreground">
                              {record.note}
                            </p>
                          )}
                          {record.images?.length > 0 && (
                            <figure className="flex flex-wrap gap-4">
                              {record.images.map((url, index) => (
                                <div key={index} className="relative">
                                  <PhotoView src={url}>
                                    <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded">
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
                        </div>
                      </div>
                      <dl className="flex flex-col justify-between text-right text-sm">
                        <div>
                          <dt className="sr-only">金額</dt>
                          <dd className="text-lg font-semibold">
                            {record.amount}
                          </dd>
                          <dt className="sr-only">帳戶</dt>
                          <dd className="text-muted-foreground">
                            {getAccountLabel(record.account)}
                          </dd>
                        </div>
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
                      </dl>
                    </div>
                  </li>
                ))}
              </PhotoProvider>
            )}
          </ul>
          {ConfirmModal}
        </>
      )}
    </div>
  );
}
