import { useEffect } from 'react';

import {
  addMonthlyExchangeRate,
  getMonthlyExchangeRate,
} from '@/lib/api/exchangeRate';
import { getEffectiveYearMonth } from '@/lib/utils/date';
import { parseCurrencyValue } from '@/lib/utils/input';

export function useExchangeRate(
  targetDate: Date,
  currency: string,
  setExchangeRate: (rate: number) => void,
) {
  useEffect(() => {
    if (
      !targetDate ||
      !currency ||
      currency === 'Common-TWD' ||
      currency === 'Asia-TWD'
    ) {
      setExchangeRate(1);
      return;
    }

    const fetchExchangeRate = async () => {
      const effectiveYearMonth = getEffectiveYearMonth(targetDate);
      const currencyValue = parseCurrencyValue(currency).value;
      const quoteKey = `TWD${currencyValue}`;

      try {
        // Firestore 取得
        const cachedRate = await getMonthlyExchangeRate(
          effectiveYearMonth,
          quoteKey,
        );

        if (cachedRate) {
          setExchangeRate(cachedRate);
          return;
        }

        // 若無該月份資料，才抓 exchangerate host API 並建立新文件
        const res = await fetch(
          `https://api.exchangerate.host/historical?access_key=${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}&source=TWD&date=${effectiveYearMonth}-01`,
        );
        const apiData = await res.json();

        if (!apiData.success || !apiData.quotes) {
          throw new Error('API 回傳錯誤');
        }

        // 儲存 API 結果到 Firestore
        await addMonthlyExchangeRate(effectiveYearMonth, {
          source: apiData.source,
          quotes: apiData.quotes,
          timestamp: apiData.timestamp,
        });

        const rate = apiData.quotes?.[quoteKey];
        if (rate) {
          setExchangeRate(rate);
        } else {
          console.warn(`API 回傳中找不到 ${quoteKey} 匯率`);
        }
      } catch (error) {
        console.error('取得匯率失敗:', error);
      }
    };

    fetchExchangeRate();
  }, [currency, setExchangeRate, targetDate]);
}
