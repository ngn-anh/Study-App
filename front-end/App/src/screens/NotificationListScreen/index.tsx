export const a = '2';
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { CaretLeft, CalendarCheck, CheckSquareOffset, CaretRight } from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { ConfirmModal } from "../../components/ConfirmModal";
import { getNotificationsByCode, markAllNotificationsRead, markNotificationRead, Notification } from "../../api/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { type } = route.params;
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationTypeName, setNotificationTypeName] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);

      setLoading(true);
      const data = await getNotificationsByCode(type, userData.user.id);
      setNotificationTypeName(data.notification_type_name)
      setNotifications(data.notifications);
      setLoading(false);
    };
    fetchData();
  }, [type]);

  const handleMarkAllRead = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);
      console.log('userData.user.id', userData.user.id)
      // Gọi API đánh dấu tất cả đã đọc
      await markAllNotificationsRead(type, userData.user.id);

      // Cập nhật local state ngay lập tức
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
            <CaretLeft size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {notificationTypeName}
            <Text style={styles.headerCount}> ({notifications.length})</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={handleMarkAllRead}>
          <CheckSquareOffset size={24} color="#083070" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <View style={styles.componentCard}>
        <ScrollView>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={[styles.card, !item.is_read && styles.unreadCard]}
              activeOpacity={0.8}
              onPress={async () => {
                console.log('item', item)
                if (item.schedule_id) {
                  navigation.navigate("ScheduleDetail", { id: item.schedule_id });
                  // Nếu chưa đọc thì gọi API đánh dấu đã đọc
                  if (!item.is_read) {
                    console.log('schedule_id', item.schedule_id)
                    await markNotificationRead(item._id);

                    // Cập nhật local state ngay lập tức
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n._id === item._id ? { ...n, is_read: true } : n
                      )
                    );
                  }
                }
              }}
            >
              {/* Badge cố định góc phải */}
              {!item.is_read && (
                <View style={styles.fixedBadge}>
                  <Text style={styles.badgeText}>N</Text>
                </View>
              )}

              <View style={styles.iconWrapper}>
                <CalendarCheck size={26} color="#083070" weight="duotone" />
              </View>

              <View style={styles.textWrapper}>
                <View style={styles.text}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                  <Text style={styles.time}>{new Date(item.created_at).toLocaleString("vi-VN")}</Text>
                </View>
                <CaretRight size={20} color="#083070" weight="bold" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Confirm Modal */}
      <ConfirmModal
        visible={showConfirmModal}
        title="Thông Báo"
        content="Đánh dấu tất cả thông báo đã đọc?"
        cancelText="Hủy"
        confirmText="Đồng Ý"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        type="confirm"
      />
    </View>
  );
};

export default NotificationListScreen;
