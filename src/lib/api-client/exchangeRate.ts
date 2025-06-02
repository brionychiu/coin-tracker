import { db, doc, getDoc } from '@/lib/firebase';
import type { ExchangeRateMonthly } from '@/types/exchange-rate';

export async function getMonthlyExchangeRate(
  yearMonth: string,
): Promise<ExchangeRateMonthly | null> {
  const docRef = doc(db, 'exchange-rates-monthly', yearMonth);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return docSnap.data() as ExchangeRateMonthly;
}
