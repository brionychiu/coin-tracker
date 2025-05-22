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
  {
    schedule: '0 * * * *',
    timeZone: 'Asia/Taipei',
  },
  async (event) => {
    const base = 'TWD';
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // e.g., "2025-05-22"

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const url = `https://api.exchangerate.host/historical?access_key=${apiKey}&source=TWD&date=${dateStr}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const docId = `${dateStr}-h${now.getHours()}`; // 例如：2025-05-22-h15
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

      console.log('✅ Exchange rate data saved (3hr test):', docId);
    } catch (err) {
      console.error('❌ Error fetching exchange rates:', err);
    }
  },
);
