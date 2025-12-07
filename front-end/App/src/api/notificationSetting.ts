export const a='2';
// src/api/notificationSetting.ts
import axios from "axios";
import { API_URL } from "@env";

export interface NotificationSetting {
  user_id: string;
  is_open_noti: boolean;
  temporary_muted_until?: string;
  temporary_muted_type?: string;
}

// Lấy trạng thái notification của user
export const getNotificationSetting = async (user_id: string) => {
  try {
    const res = await axios.get<NotificationSetting>(`${API_URL}/notification-setting/${user_id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching notification setting:", error);
    throw error;
  }
};

// Cập nhật trạng thái notification của user
export const updateNotificationSetting = async (
  user_id: string,
  payload: Partial<NotificationSetting>
) => {
  try {
    const res = await axios.put<NotificationSetting>(
      `${API_URL}/notification-setting/${user_id}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error("Error updating notification setting:", error);
    throw error;
  }
};

