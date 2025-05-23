import { Timestamp } from '@/lib/firebase';

export type ExchangeRateMonthly = {
  createdAt?: Timestamp;
  source: string;
  quotes: {
    [key: string]: number; // e.g. TWDUSD: 0.033276
  };
  timestamp: number;
};

export type ExchangeRateMonthlyPayload = Omit<ExchangeRateMonthly, 'createdAt'>;
