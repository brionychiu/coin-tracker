import { useCallback, useEffect, useState } from 'react';

import {
  addMonthlyExchangeRate,
  getMonthlyExchangeRate,
} from '@/lib/api-client/exchangeRate';
import { getEffectiveYearMonth } from '@/lib/utils/date';
import { parseCurrencyValue } from '@/lib/utils/input';

interface UseExchangeRateProps {
  targetDate: Date;
  currency: string;
  enabled?: boolean;
}

export function useExchangeRate({
  targetDate,
  currency,
  enabled = true,
}: UseExchangeRateProps) {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    if (!targetDate || !currency) return;

    if (currency === 'Common-TWD' || currency === 'Asia-TWD') {
      setExchangeRate(1);
      return;
    }

    setIsLoading(true);
    setError(null);

    const effectiveYearMonth = getEffectiveYearMonth(targetDate); // 'YYYY-MM'
    const currencyValue = parseCurrencyValue(currency).value; // e.g., 'USD'
    const quoteKey = `TWD${currencyValue}`;

    try {
      // 先從 Firestore 快取查詢
      const cachedRate = await getMonthlyExchangeRate(
        effectiveYearMonth,
        quoteKey,
      );

      if (cachedRate) {
        setExchangeRate(cachedRate);
        return;
      }

      // 若無快取，則發送 API 並儲存至 Firestore
      const apiUrl = `https://api.exchangerate.host/historical?access_key=${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}&source=TWD&date=${effectiveYearMonth}-01`;
      const res = await fetch(apiUrl);
      const apiData = await res.json();

      if (!apiData.success || !apiData.quotes) {
        throw new Error('API 回傳錯誤');
      }

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
        setExchangeRate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('取得匯率失敗'));
      setExchangeRate(null);
    } finally {
      setIsLoading(false);
    }
  }, [currency, targetDate]);

  useEffect(() => {
    if (enabled) {
      fetchExchangeRate();
    }
  }, [enabled, fetchExchangeRate]);

  return {
    exchangeRate,
    isLoading,
    error,
    refetch: fetchExchangeRate,
  };
}
