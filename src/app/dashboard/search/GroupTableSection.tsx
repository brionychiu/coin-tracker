import { ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { Button } from '@/components/ui/button';
import { highlightText } from '@/components/ui/highlight-text';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getAccountLabelById } from '@/lib/utils/account';
import {
  getCategoryIconById,
  getCategoryLabelById,
} from '@/lib/utils/categories';
import { formatToShortDay } from '@/lib/utils/format';
import { getCurrencyLabel } from '@/lib/utils/input';
import { Account } from '@/types/account';
import { AccountingRecord } from '@/types/accounting';
import { Category } from '@/types/category';

interface GroupTableSectionProps {
  group: string;
  groupItems: AccountingRecord[];
  debouncedKeyword: string;
  accountMap: Record<string, Account>;
  categoryMap: Record<string, Category>;
  onEdit: (record: AccountingRecord) => void;
  onDelete: (record: AccountingRecord) => void;
}

export const GroupTableSection = ({
  group,
  groupItems,
  debouncedKeyword,
  accountMap,
  categoryMap,
  onEdit,
  onDelete,
}: GroupTableSectionProps) => (
  <div key={group}>
    <div className="sticky top-[40px] z-20 bg-muted px-4 py-2 text-lg font-bold">
      {group}
    </div>
    <Table className="w-full table-fixed">
      <TableBody>
        {groupItems.map((record) => (
          <TableRow key={record.id} className="hover:bg-system-02">
            <TableCell className="w-[12.5%]">
              <div className="flex items-center">
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
                <span>
                  {getCategoryLabelById(record.categoryId, categoryMap)}
                </span>
              </div>
            </TableCell>
            <TableCell className="w-[12.5%]">
              {formatToShortDay(record.date)}
            </TableCell>
            <TableCell className="w-[37.5%] truncate">
              {record.note ? highlightText(record.note, debouncedKeyword) : '-'}
            </TableCell>
            <TableCell className="w-[12.5%] text-right">
              {getAccountLabelById(record.accountId, accountMap)}
            </TableCell>
            <TableCell className="w-[25%] font-semibold">
              <div className="flex justify-between">
                <p className="break-keep">
                  <span>{record.amount}</span>
                  <span className="ml-1 text-xs">
                    {getCurrencyLabel(record.currency)}
                  </span>
                </p>
                <div className="mt-1 flex gap-2">
                  {record.images.length > 0 && (
                    <PhotoProvider>
                      {record.images.map((url, index) => (
                        <PhotoView key={index} src={url}>
                          {index === 0 ? (
                            <Button
                              type="button"
                              variant="iconHover"
                              size="icon"
                              title="預覽圖片"
                            >
                              <ImageIcon className="size-4" />
                            </Button>
                          ) : (
                            // 給 PhotoView 一個不可見但合法的 children（避免 false/null）
                            <span className="hidden" />
                          )}
                        </PhotoView>
                      ))}
                    </PhotoProvider>
                  )}

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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
