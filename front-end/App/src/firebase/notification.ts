// src/firebase/notification.ts
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/RootNavigation';
import { markNotificationRead } from '../api/notification';

// Cờ ngăn listener gọi nhiều lần
let isForegroundListenerSet = false;

// -------------------- Tạo kênh Android --------------------
export const createDefaultChannel = async () => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }
};

// --------------------  Lấy FCM token --------------------
export const getFCMToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        console.log('FCM Token:', token);
        return token;
      }
    } catch (error) {
      console.error('FCM token error:', error);
    }
  } else {
    console.log('FCM Token (from storage):', fcmToken);
    return fcmToken;
  }
};

// --------------------  Request permission --------------------
export const requestUserPermission = async () => {
  let enabled = false;
  if (Platform.OS === 'android') {
    const granted = await messaging().requestPermission();
    enabled = granted === messaging.AuthorizationStatus.AUTHORIZED;
  } else {
    const authStatus = await messaging().requestPermission();
    enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }

  if (enabled) {
    console.log(' Notification permission granted');
    await getFCMToken();
  } else {
    console.log(' Notification permission denied');
  }
};

// --------------------  Hiển thị notification --------------------
const displayNotification = async (remoteMessage: any) => {
  const { title, body } = remoteMessage.notification || {};
  if (!title || !body) return;
  const data = remoteMessage.data || {};

  const androidOptions: any = {
    channelId: 'default',
    pressAction: { id: 'default' },
    smallIcon: 'ic_launcher',
  };

  // Style cho body dài hoặc có ảnh
  const image =
    (remoteMessage?.notification as any)?.android?.imageUrl ||
    (remoteMessage?.notification as any)?.imageUrl ||
    remoteMessage?.data?.image;

  if (image) {
    androidOptions.style = { type: AndroidStyle.BIGPICTURE, picture: image };
  } else if (body.length > 50) {
    androidOptions.style = { type: AndroidStyle.BIGTEXT, text: body };
  }

  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(`${title}: ${body}`, ToastAndroid.SHORT, ToastAndroid.TOP);
  }

  console.log(title,body,image)

  await notifee.displayNotification({ title, body, android: androidOptions,data });
};

// --------------------  Foreground listener --------------------
export const setupForegroundListener = async () => {
  if (isForegroundListenerSet) return;
  isForegroundListenerSet = true;

  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Nhấn notification từ background
  messaging().onNotificationOpenedApp(remoteMessage => {
    const scheduleId = remoteMessage?.data?.scheduleId as string;
    const notiId = remoteMessage?.data?.notiId as string;
    console.log("Background open:", scheduleId);

    if (scheduleId) {
      navigate("ScheduleDetail", { id: scheduleId });
       markNotificationRead(notiId).then();
    }
  });

  // Khi mở app từ killed state
  const initialNotification = await messaging().getInitialNotification();
  if (initialNotification) {
    const scheduleId = initialNotification.data?.scheduleId as string;
    const notiId = initialNotification?.data?.notiId as string;
    console.log("Killed state open:", initialNotification);

    if (scheduleId) {
      setTimeout(() => {
        navigate("ScheduleDetail", { id: scheduleId });
         markNotificationRead(notiId).then();
      }, 500);
    }
  }
};

// --------------------  Xử lý nhấn notification (foreground) --------------------
export const registerNotificationEvents = () => {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
        const scheduleId = detail?.notification?.data?.scheduleId as string;
        const notiId = detail?.notification?.data?.notiId as string;
        console.log("Foreground press:", scheduleId);

        if (scheduleId) {
         navigate("ScheduleDetail", { id: scheduleId });
         markNotificationRead(notiId).then();
        }
    }
  });
};
