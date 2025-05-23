import { db, doc, getDoc, serverTimestamp, setDoc } from '@/lib/firebase';
import type { ExchangeRateMonthlyPayload } from '@/types/exchange-rate';

export async function getMonthlyExchangeRate(
  yearMonth: string,
  quoteKey: string,
): Promise<number | null> {
  const docRef = doc(db, 'exchange-rates-monthly', yearMonth);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const rate = data.quotes?.[quoteKey];
    return typeof rate === 'number' ? rate : null;
  }

  return null;
}

export async function addMonthlyExchangeRate(
  yearMonth: string,
  data: ExchangeRateMonthlyPayload,
) {
  const docRef = doc(db, 'exchange-rates-monthly', yearMonth);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function fetchMonthlyFirstDayRates() {
  const key = process.env.EXCHANGE_RATE_API_KEY;
  const url = `https://api.exchangerate.host/timeframe?access_key=${key}&start_date=2025-01-01&end_date=2025-04-30&source=TWD`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json.success) {
    throw new Error('API failed');
  }

  const quotes = json.quotes as Record<string, Record<string, number>>;

  // 只取每月第一天的資料
  const firstDays = Object.keys(quotes).filter((dateStr) =>
    dateStr.endsWith('-01'),
  );

  for (const dateStr of firstDays) {
    const yearMonth = dateStr.slice(0, 7);
    const dailyQuotes = quotes[dateStr];

    await addMonthlyExchangeRate(yearMonth, {
      source: json.source, // ex: 'USD' 或 'TWD'
      quotes: dailyQuotes, // 格式如 { USDGBP: 0.66, USDJPY: 151.3 }
      timestamp: Math.floor(new Date(dateStr).getTime() / 1000),
    });

    console.log(`✅ Saved ${yearMonth}`);
  }
}
