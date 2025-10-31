// SubjectList.tsx
import React from "react";
import { styles } from "./SubjectList.styles";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

const subjects = [
  { id: "1", name: "Tin học", icon: require("../../assets/icons/computer.png") },
  { id: "2", name: "Ngữ Văn", icon: require("../../assets/icons/book.png") },
  { id: "3", name: "Toán", icon: require("../../assets/icons/math.png") },
  { id: "4", name: "Tiếng Anh", icon: require("../../assets/icons/english.png") },
  { id: "5", name: "Địa lý", icon: require("../../assets/icons/map.png") },
  { id: "6", name: "Lý", icon: require("../../assets/icons/math.png") }, // ví dụ thêm môn
];

const SubjectList: React.FC = () => {
   const renderItem = ({ item }: { item: typeof subjects[0] }) => (
    <View style={styles.item}>
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.text}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tự luyện</Text>
        <Image source={require("../../assets/icons/filter.png")} style={styles.filterIcon} />
      </View>

      {/* Horizontal list */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: 35 }} />} // khoảng cách giữa các item
      />
    </View>
  );
};

export default SubjectList;
