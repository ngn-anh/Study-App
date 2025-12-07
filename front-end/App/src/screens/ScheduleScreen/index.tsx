export const a = '2';
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CaretLeftIcon,
  TrashIcon,
  CalendarCheckIcon,
  CheckSquareIcon,
  SquareIcon,
  PlusIcon,
} from "phosphor-react-native";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { styles } from "./index.styles";
import { RootStackParamList } from "../../types/data";
import { DeleteModal } from "../../components/DeleteModal";
import { deleteManySchedules, getSchedules } from "../../api/reminderSchedules";
import { getRemainingTime } from "../../utils/time";

interface Schedule {
  _id: string;
  title: string;
  note: string;
  due_date: string;
  due_time: string;
  remind_date: string;
  remind_time: string;
  repeat_mode: string;
}

const ScheduleScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy danh sách lịch hẹn
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;
      const userJson = JSON.parse(userData);
      const data = await getSchedules(userJson.user.id);
      setSchedules(data);
    } catch (error) {
      console.error("Fetch schedules error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSchedules(); // mỗi lần màn danh sách focus lại thì fetch mới
    }, [])
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLongPress = (id: string) => {
    if (!isSelectMode) {
      setIsSelectMode(true);
      setSelectedIds([id]);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      console.log('selectedIds', selectedIds)
      // Gọi API BE xóa mềm nhiều lịch hẹn
      await deleteManySchedules(selectedIds);

      // Update UI: loại bỏ các lịch đã xóa
      setSchedules((prev) => prev.filter((s) => !selectedIds.includes(s._id)));

      // Reset chế độ chọn
      setSelectedIds([]);
      setIsSelectMode(false);
      setModalVisible(false);
    } catch (error) {
      console.error("Xoá lịch hẹn lỗi:", error);
    }
  };

  const renderItem = ({ item }: { item: Schedule }) => {
    const selected = selectedIds.includes(item._id);
    const remaining = getRemainingTime(item.due_date, item.due_time);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => handleLongPress(item._id)}
        onPress={() => (isSelectMode ? toggleSelect(item._id) : null)}
        style={styles.cardContainer}
      >
        <View style={styles.cardLeft}>
          {isSelectMode ? (
            selected ? (
              <CheckSquareIcon size={22} color="#0066FF" weight="fill" />
            ) : (
              <SquareIcon size={22} color="#0066FF" weight="duotone" />
            )
          ) : null}
          <View style={[styles.iconBox, { marginLeft: isSelectMode ? 10 : 0 }]}>
            <CalendarCheckIcon size={24} color="#0066FF" weight="fill" />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ScheduleDetail", { id: item._id })}
          style={styles.cardContent}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDate}>
            Ngày tới hạn {item.due_time} - {new Date(item.due_date).toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.cardTag,
            {
              backgroundColor: remaining.bgColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            },
          ]}
        >
          <Text style={{ color: remaining.color, fontWeight: '500', fontSize: 11 }}>
            {remaining.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() =>
              isSelectMode ? setIsSelectMode(false) : navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "MainTabs",
                    state: {
                      index: 0, // chọn tab Service
                      routes: [
                        { name: "Service" },
                        { name: "Home" },
                        { name: "Profile" },
                      ],
                    },
                  },
                ],
              })
            }
          >
            <CaretLeftIcon size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lịch hẹn</Text>
        </View>

        {isSelectMode && (
          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => setModalVisible(true)}
          >
            <TrashIcon size={24} color="#E53935" weight="fill" />
            <Text style={styles.trashCount}>({selectedIds.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Danh sách */}
      <FlatList
        data={schedules}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Nút thêm mới */}
      <TouchableOpacity
        style={[styles.addButton, isSelectMode && styles.addButtonDisabled]}
        activeOpacity={isSelectMode ? 1 : 0.8}
        disabled={isSelectMode}
        onPress={() =>
          navigation.navigate("CreateUpdateSchedule", { id: undefined })
        }
      >
        <PlusIcon size={16} color="#fff" weight="bold" />
        <Text style={styles.addText}>Thêm Mới</Text>
      </TouchableOpacity>

      {/* Modal Xóa */}
      <DeleteModal
        visible={modalVisible}
        title="Xóa Lịch Hẹn"
        content={`Bạn có chắc chắn muốn xóa ${selectedIds.length} lịch hẹn này?`}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

export default ScheduleScreen;
