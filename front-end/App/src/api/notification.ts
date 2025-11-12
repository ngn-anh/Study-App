import axios from "axios";
import { API_URL } from "@env"; // nếu bạn đang dùng react-native-dotenv

export interface Notification {
  _id: string;
  schedule_id: string | null;
  name: string;
  description: string;
  image: string;
  is_read: boolean;
  created_at: Date; 
}

export interface NotificationResponse {
  notification_type_name: string;
  notifications: Notification[];
}

export const getNotificationTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notification-types`);
    return response.data.data; // lấy mảng data trong response
  } catch (error) {
    console.error("Lỗi khi gọi API notification-types:", error);
    return [];
  }
};

export const getNotificationsByCode = async (code: string): Promise<NotificationResponse> => {
  try {
    const res = await axios.get(`${API_URL}/notifications?code=${code}`);
    return res.data?.data || { notification_type_name: '', notifications: [] };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notification_type_name: '', notifications: [] };
  }
};

export const markAllNotificationsRead = async (code: string) => {
  try {
    const res = await axios.patch(`${API_URL}/notifications/mark-all-read?type=${code}`);
    return res.data;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
};

// Đánh dấu 1 notification đã đọc
export const markNotificationRead = async (notificationId: string) => {
  try {
    const res = await axios.patch(`${API_URL}/notifications/${notificationId}/mark-read`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
};
