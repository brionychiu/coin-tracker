import { db, doc, getDoc, serverTimestamp, setDoc } from '@/lib/firebase';
import type {
  ExchangeRateMonthly,
  ExchangeRateMonthlyPayload,
} from '@/types/exchange-rate';

export async function getMonthlyExchangeRate(
  yearMonth: string,
): Promise<ExchangeRateMonthly | null> {
  const docRef = doc(db, 'exchange-rates-monthly', yearMonth);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return docSnap.data() as ExchangeRateMonthly;
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
