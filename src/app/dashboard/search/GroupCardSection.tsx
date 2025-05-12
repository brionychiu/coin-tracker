import { Pencil, Search, Trash2 } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { Button } from '@/components/ui/button';
import { highlightText } from '@/components/ui/highlight-text';
import { getCategoryIconById, getCategoryLabelById } from '@/lib/categories';
import { formatToShortDay } from '@/lib/format';
import { getAccountLabelById } from '@/lib/utils/account';
import { Account } from '@/types/account';
import { AccountingRecord } from '@/types/accounting';
import { Category } from '@/types/category';

interface GroupSectionProps {
  group: string;
  groupItems: AccountingRecord[];
  debouncedKeyword: string;
  categoryMap: Record<string, Category>;
  accountMap: Record<string, Account>;
  onEdit: (record: AccountingRecord) => void;
  onDelete: (record: AccountingRecord) => void;
}

export const GroupCardSection = ({
  group,
  groupItems,
  debouncedKeyword,
  accountMap,
  categoryMap,
  onEdit,
  onDelete,
}: GroupSectionProps) => (
  <div key={group} className="mb-6">
    <h2 className="mb-2 text-sm font-medium text-muted-foreground">{group}</h2>
    <div className="space-y-4">
      {groupItems.map((record) => (
        <div
          key={record.id}
          className="rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-8 w-8 items-center justify-center">
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
              <div className="space-y-1">
                <p className="font-medium">
                  {getCategoryLabelById(record.categoryId, categoryMap)}
                </p>
                {record.note && (
                  <p className="text-sm text-muted-foreground">
                    {highlightText(record.note, debouncedKeyword)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatToShortDay(record.date)}
                </p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-lg font-semibold">{record.amount}</p>
              <p className="text-muted-foreground">
                {getAccountLabelById(record.accountId, accountMap)}
              </p>
            </div>
          </div>

          {record.images.length > 0 && (
            <PhotoProvider>
              <div className="mt-2 flex flex-wrap gap-4">
                {record.images.map((url, index) => (
                  <div key={index} className="relative">
                    <PhotoView src={url}>
                      <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded">
                        <img
                          src={url}
                          alt={`圖片 ${index + 1}`}
                          className="object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100">
                          <Search className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </PhotoView>
                  </div>
                ))}
              </div>
            </PhotoProvider>
          )}

          <div className="mt-3 flex justify-end gap-2">
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
              onClick={() => onDelete(record)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
