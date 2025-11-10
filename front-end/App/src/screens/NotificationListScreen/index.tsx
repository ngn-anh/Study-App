import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { CaretLeft, CalendarCheck, CheckSquareOffset, CaretRight } from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { ConfirmModal } from "../../components/ConfirmModal";

const NotificationListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { type } = route.params;
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const reminders = [
    {
      id: 1,
      title: "Lịch thi thử lần 1 sắp đến hạn",
      description: "Lịch thi lần 1 của bạn còn 1 ngày nữa là diễn ra. Vui lòng để ý để không bị bỏ lỡ.",
      time: "11:52 - 25/02/2025",
      isRead: true,
    },
    {
      id: 2,
      title: "Lịch kiểm tra môn Toán",
      description: "Lịch kiểm tra môn Toán sẽ diễn ra vào ngày mai.",
      time: "08:05 - 25/02/2025",
      isRead: false,
    },
     {
      id: 3,
      title: "Lịch kiểm tra môn Tiếng Anh",
      description: "Lịch kiểm tra môn Tiếng Anh sẽ diễn ra vào ngày mai.",
      time: "08:05 - 25/02/2025",
      isRead: true,
    },
     {
      id: 4,
      title: "Lịch kiểm tra môn Hóa",
      description: "Lịch kiểm tra môn Hóa sẽ diễn ra vào ngày mai.",
      time: "08:05 - 25/02/2025",
      isRead: true,
    },
  ];

  const handleMarkAllRead = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    // Tạm thời chỉ đóng modal, sau này bạn có thể thêm logic đánh dấu đã đọc
    setShowConfirmModal(false);
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
            {type}
            <Text style={styles.headerCount}> ({reminders.length})</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={handleMarkAllRead}>
          <CheckSquareOffset size={24} color="#083070" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <View style={styles.componentCard}>
        <ScrollView>
          {reminders.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, !item.isRead && styles.unreadCard]}
              activeOpacity={0.8}
            >
              {/* Badge cố định góc phải */}
              {!item.isRead && (
                <View style={styles.fixedBadge}>
                  <Text style={styles.badgeText}>N</Text>
                </View>
              )}

              <View style={styles.iconWrapper}>
                <CalendarCheck size={26} color="#083070" weight="duotone" />
              </View>

              <View style={styles.textWrapper}>
                <View style={styles.text}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                  <Text style={styles.time}>{item.time}</Text>
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
