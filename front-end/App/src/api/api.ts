export const a='1';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/RootNavigation';
import { Alert } from 'react-native';
import { API_URL } from '@env';


export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn token mặc định
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * 🔥 Interceptor kiểm tra token hết hạn
 */
api.interceptors.request.use(async (config) => {
  const data = await AsyncStorage.getItem("userData");

  if (!data) return config;

  const userData = JSON.parse(data);
  const now = Math.floor(Date.now() / 1000);

  if (userData?.user?.token_expired <= now) {
    // Token hết hạn → logout toàn app
    await AsyncStorage.removeItem("userData");

    Alert.alert("Phiên đăng nhập đã hết hạn", "Vui lòng đăng nhập lại.");

    navigationRef.navigate("AuthScreen" as never);

    return Promise.reject("TOKEN_EXPIRED");
  }

  return config;
});

export default api;
