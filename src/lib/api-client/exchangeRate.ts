import { db, doc, getDoc, serverTimestamp, setDoc } from '@/lib/firebase';

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

export async function addMonthlyExchangeRate(yearMonth: string, data: any) {
  const docRef = doc(db, 'exchange-rates-monthly', yearMonth);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}
