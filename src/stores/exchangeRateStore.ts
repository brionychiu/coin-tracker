import { create } from 'zustand';

import { getMonthlyExchangeRate } from '@/lib/api-client/exchangeRate';
import { ExchangeRateMonthly } from '@/types/exchange-rate';

type ExchangeRateStore = {
  rates: Record<string, ExchangeRateMonthly>;
  loading: boolean;
  error: string | null;
  setRate: (yearMonth: string, rate: ExchangeRateMonthly) => void;
  getRate: (yearMonth: string) => ExchangeRateMonthly | undefined;
  ensureRate: (yearMonth: string) => Promise<ExchangeRateMonthly | null>;
};

export const useExchangeRateStore = create<ExchangeRateStore>((set, get) => ({
  rates: {},
  loading: false,
  error: null,

  setRate: (yearMonth, rate) =>
    set((state) => ({
      rates: {
        ...state.rates,
        [yearMonth]: rate,
      },
    })),

  getRate: (yearMonth) => get().rates[yearMonth],

  ensureRate: async (yearMonth) => {
    const existing = get().getRate(yearMonth);
    if (existing) return existing;

    set({ loading: true, error: null });

    try {
      const fetched = await getMonthlyExchangeRate(yearMonth);
      if (fetched) {
        get().setRate(yearMonth, fetched);
        return fetched;
      } else {
        set({ error: '匯率資料為空', loading: false });
        return null;
      }
    } catch (e) {
      set({ error: '匯率資料載入失敗', loading: false });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
