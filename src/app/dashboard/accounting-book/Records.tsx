import { Pencil, Trash2 } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { useConfirm } from '@/hooks/useConfirmModal';
import { deleteAccountingRecord } from '@/lib/api/accounting';
import { getCategoryIcon, getCategoryLabel } from '@/lib/categories';
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
      {loading && <p>Loading...</p>}

      <ul className="mt-4 space-y-2">
        <h2 className="pb-2 text-center text-xl font-bold">
          {date ? date.toLocaleDateString('zh-TW') : ''} 的記帳項目
        </h2>
        {filteredRecords.length === 0 ? (
          <p>⚠ 本日無記帳紀錄</p>
        ) : (
          filteredRecords.map((record) => (
            <li key={record.id} className="rounded-2xl border p-2 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p>{getCategoryIcon(record.category)}</p>
                  <p>{getCategoryLabel(record.category)}</p>
                  {record.note && <p>{record.note}</p>}
                </div>
                <div>
                  <p>{record.amount}</p>
                  <p>{record.account}</p>
                </div>
              </div>
              {record.images && record.images.length > 0 && (
                <div>
                  <PhotoProvider>
                    <div className="flex gap-2">
                      {record.images.map((url, index) => (
                        <PhotoView key={index} src={url}>
                          <img
                            src={url}
                            alt="收據"
                            className="h-16 w-16 rounded object-cover"
                          />
                        </PhotoView>
                      ))}
                    </div>
                  </PhotoProvider>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEdit(record)}
                className="mr-5"
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(record)}
              >
                <Trash2 />
              </Button>
            </li>
          ))
        )}
      </ul>
      {ConfirmModal}
    </div>
  );
}
