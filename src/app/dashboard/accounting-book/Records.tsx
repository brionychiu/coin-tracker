import { getCategoryIcon, getCategoryLabel } from '@/lib/categories';
import { db } from '@/lib/firebase';
import { endOfMonth, isSameDay, startOfMonth } from 'date-fns';
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface AccountingRecord {
  id: string;
  date: Timestamp;
  amount: string;
  category: string;
  account: string;
  note?: string;
  images?: string[];
}

interface RecordsProps {
  date: Date | undefined;
  month: number;
}

export default function Records({ date, month }: RecordsProps) {
  const [records, setRecords] = useState<AccountingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AccountingRecord[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    console.log('2日期變動:', date);
  }, [date]); // 每次日期變動時觸發

  // 🔹 計算當前月份的時間範圍
  const startTimestamp = Timestamp.fromDate(
    startOfMonth(new Date(now.getFullYear(), month, 1)),
  );
  const endTimestamp = Timestamp.fromDate(
    endOfMonth(new Date(now.getFullYear(), month, 1)),
  );

  // 🔥 查詢當月份的記帳紀錄
  async function fetchRecords() {
    try {
      const q = query(
        collection(db, 'accounting-records'),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
      );
      // 使用 onSnapshot 來監聽資料變動
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AccountingRecord[];

        console.log('data', data);

        setRecords(data);
        // 根據日期篩選資料
        if (date) {
          const filtered = data.filter((record) =>
            isSameDay(record.date.toDate(), date),
          );
          console.log('filteredRecords2', filtered);
          setFilteredRecords(filtered);
        }
      });

      // 清理監聽器
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }

  // 🔥 即時監聽當月份的 Firestore 記錄
  useEffect(() => {
    setLoading(true);
    fetchRecords();
    setLoading(false);
  }, [month]); // 每次月份變動時觸發

  // 🔥 處理當日期變動時的篩選
  useEffect(() => {
    if (date) {
      const filteredRecords = records.filter((record) =>
        isSameDay(record.date.toDate(), date),
      );
      console.log('filteredRecords2', filteredRecords);
      setFilteredRecords(filteredRecords);
    }
  }, [date]); // 當日期變動時，根據日期篩選記錄

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
