/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { DateTime } from 'luxon';

admin.initializeApp();

export const fetchExchangeRates = onSchedule(
  // 每月 2 號早上 08:10（UTC+8），抓取前天的資料（UTC 1 號) 執行
  // Doc: https://exchangerate.host/faq
  {
    schedule: '10 8 2 * *',
    timeZone: 'Asia/Taipei',
  },
  async (event) => {
    const base = 'TWD';
    const taipeiNow = DateTime.now().setZone('Asia/Taipei');

    // 要查詢的日期是「前一天」，即 1 號的 EOD 匯率
    const targetDate = taipeiNow.minus({ days: 1 });
    const dateStr = targetDate.toFormat('yyyy-MM-dd');

    // yyyy-MM
    const docId = dateStr.slice(0, 7); // e.g., "2025-06"

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const url = `https://api.exchangerate.host/historical?access_key=${apiKey}&source=TWD&date=${dateStr}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      await admin
        .firestore()
        .collection('exchange-rates-monthly')
        .doc(docId)
        .set({
          source: base,
          timestamp: data.timestamp,
          quotes: data.quotes,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log('✅ Exchange rate data saved (3hr test):', docId, data);
    } catch (err) {
      console.error('❌ Error fetching exchange rates:', err);
    }
  },
);
