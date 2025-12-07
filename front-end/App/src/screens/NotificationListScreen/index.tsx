import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { CaretLeft, CalendarCheck, CheckSquareOffset, CaretRight } from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { ConfirmModal } from "../../components/ConfirmModal";
import { getNotificationsByCode, markAllNotificationsRead, markNotificationRead, Notification } from "../../api/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LIMIT = 10;

const NotificationListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { type } = route.params;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [notificationTypeName, setNotificationTypeName] = useState<string>();
  const [userId, setUserId] = useState<string>("");

  // --- Lấy userId ---
  useEffect(() => {
    (async () => {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) return;
      const userData = JSON.parse(userDataStr);
      setUserId(userData.user.id);
    })();
  }, []);

  // --- Fetch notifications ---
  const fetchNotifications = useCallback(async (reset = false) => {
    if (!userId) return;
    try {
      if (reset) {
        setPage(1);
        setHasMore(true);
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await getNotificationsByCode(type, userId, page, LIMIT);
      console.log('page', page)
      console.log('res', res)
      if (reset) {
        setNotifications(res.notifications);
        setNotificationTypeName(res.notification_type_name);
      } else {
        setNotifications(prev => {
          const map = new Map();
          [...prev, ...res.notifications].forEach(item => map.set(item._id, item));
          return Array.from(map.values());
        });

      }

      setHasMore(res.notifications.length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId, type, page]);

  // --- Khi type hoặc userId thay đổi, fetch lại ---
  useEffect(() => {
    if (!userId) return;
    fetchNotifications(true);
  }, [userId, type]);

  // --- Load more ---
  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page === 1) return;
    fetchNotifications();
  }, [page]);

  // --- Mark all read ---
  const handleConfirm = async () => {
    try {
      await markAllNotificationsRead(type, userId);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirmModal(false);
    }
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
        <TouchableOpacity onPress={() => setShowConfirmModal(true)}>
          <CheckSquareOffset size={24} color="#083070" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>Đang tải...</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.05}
          contentContainerStyle={styles.componentCard}
          ListFooterComponent={loadingMore ? <Text style={{ textAlign: 'center', padding: 10 }}>Đang tải thêm...</Text> : null}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.is_read && styles.unreadCard]}
              activeOpacity={0.8}
              onPress={async () => {
                if (item.schedule_id) {
                  navigation.navigate("ScheduleDetail", { id: item.schedule_id });
                  if (!item.is_read) {
                    await markNotificationRead(item._id);
                    setNotifications(prev =>
                      prev.map(n => n._id === item._id ? { ...n, is_read: true } : n)
                    );
                  }
                }
              }}
            >
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
                  <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                  {item.description && <Text style={styles.description} numberOfLines={1}>{item.description}</Text>}
                  <Text style={styles.time}>{new Date(item.created_at).toLocaleString("vi-VN")}</Text>
                </View>
                <CaretRight size={18} color="#083070" weight="bold" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.block}></View>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={showConfirmModal}
        title="Thông Báo"
        content="Đánh dấu tất cả thông báo đã đọc?"
        cancelText="Hủy"
        confirmText="Đồng Ý"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        type="confirm"
      />
    </View>
  );
};

export default NotificationListScreen;
