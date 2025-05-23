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

admin.initializeApp();

export const fetchExchangeRates = onSchedule(
  // 每月初（1 號）執行
  {
    schedule: '0 0 1 * *',
    timeZone: 'Asia/Taipei',
  },
  async (event) => {
    const base = 'TWD';
    const now = new Date();

    // yyyy-mm 格式
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
    const docId = `${year}-${month}`;
    const dateStr = `${year}-${month}-01`;

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
