import { useAccountingRecords } from '@/hooks/useAccountingRecords';
import { getCategoryIcon, getCategoryLabel } from '@/lib/categories';

interface RecordsProps {
  date: Date | undefined;
  month: number;
}

export default function Records({ date, month }: RecordsProps) {
  const { filteredRecords, loading } = useAccountingRecords(date, month);

  return (
    <div className="rounded-2xl">
      {loading && <p>Loading...</p>}

      <ul className="mt-4 space-y-2">
        <h2 className="pb-2 text-center text-xl font-bold">
          {date ? date.toLocaleDateString('zh-TW') : ''} 的記帳記錄
        </h2>
        {filteredRecords.length === 0 ? (
          <p>⚠ 本日無記帳紀錄</p>
        ) : (
          filteredRecords.map((record) => (
            <li key={record.id} className="rounded-2xl border p-2 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p>{getCategoryIcon(record.category)}</p>
                  <p> {getCategoryLabel(record.category)}</p>
                  {record.note && <p>{record.note}</p>}
                </div>
                <div>
                  <p>{record.amount}</p>
                  <p>{record.account}</p>
                </div>
              </div>
              {record.images && record.images.length > 0 && (
                <div>
                  <p>📷 收據：</p>
                  <div className="flex gap-2">
                    {record.images.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="收據"
                        className="h-16 w-16 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
