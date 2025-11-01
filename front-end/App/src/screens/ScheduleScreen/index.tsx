import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  CaretLeftIcon,
  TrashIcon,
  CalendarCheckIcon,
  CheckSquareIcon,
  SquareIcon,
  PlusIcon,
} from "phosphor-react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { styles } from "./index.styles";
import { RootStackParamList } from "../../types/data";
import { DeleteModal } from "../../components/DeleteModal";

const appointments = [
  {
    id: "1",
    title: "Lịch kiểm tra giữa kỳ 1",
    date: "Ngày tới hạn 15:42 PM - 01/08/2022",
    remain: "Còn 9 phút",
  },
  {
    id: "2",
    title: "Lịch thi thử đợt 1",
    date: "Ngày tới hạn 01/08/2022",
    remain: "Còn 6 phút",
  },
  {
    id: "3",
    title: "Lịch thi thử đợt 1",
    date: "Ngày tới hạn 01/08/2022",
    remain: "Còn 6 phút",
  },
];

const ScheduleScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleDelete = () => {
    console.log("Xoá:", selectedIds);
    setSelectedIds([]);
    setIsSelectMode(false);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const selected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => handleLongPress(item.id)}
        onPress={() => (isSelectMode ? toggleSelect(item.id) : null)}
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
            <CalendarCheckIcon size={28} color="#0066FF" weight="fill" />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ScheduleDetail", { id: item.id })}
          style={styles.cardContent}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </TouchableOpacity>

        <View style={styles.cardTag}>
          <Text style={styles.cardTagText}>{item.remain}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() =>
              isSelectMode ? setIsSelectMode(false) : navigation.goBack()
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
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Nút thêm mới */}
      <TouchableOpacity
        style={[styles.addButton, isSelectMode && styles.addButtonDisabled]}
        activeOpacity={isSelectMode ? 1 : 0.8}
        disabled={isSelectMode}
        onPress={() =>
          navigation.navigate({
            name: "CreateUpdateSchedule",
            params: {},
          })
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
