// src/firebase-admin.ts
import admin from 'firebase-admin';
import * as path from 'path';

// 🔹 Khởi tạo Firebase Admin
const serviceAccount = require(path.join(__dirname, '../src/my-service-account.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 🔹 Gửi FCM notification
export async function sendFCMNotification(
  fcmToken: string,
  title: string,
  body: string,
  data: Record<string, string> = {},
  image?: string
) {
  const message: admin.messaging.Message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        defaultSound: true,
      },
    },
    apns: {
      headers: { 'apns-priority': '10' },
      payload: {
        aps: { sound: 'default', alert: { title, body }, contentAvailable: true },
      },
    },
    data, // dữ liệu điều hướng app
  };

  try {
    await admin.messaging().send(message);
    console.log('✅ FCM notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending FCM notification:', error);
  }
}
