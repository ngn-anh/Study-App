import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./index.styles";
import { ArrowLeftIcon, CaretLeft, MagnifyingGlassIcon, SnowflakeIcon, TrophyIcon } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

const data = [
  { id: "1", name: "Anh Nguyễn Đăng Thành An", score: 100, time: "0' 40\"", tag: "top" },
  { id: "2", name: "Anh Vũ Lê Minh", score: 100, time: "0' 57\"" },
  { id: "3", name: "Anh Đặng Tuệ Sơn", score: 90, time: "0' 60\"" },
  { id: "4", name: "Chị Nguyễn Thanh Thảo", score: 85, time: "0' 60\"", tag: "ngắn" },
  { id: "5", name: "Anh Nguyễn Đăng Thành An", score: 100, time: "0' 57\"" },
  { id: "6", name: "Anh Vũ Lê Minh", score: 100, time: "0' 57\"" },
  { id: "8", name: "Chị Nguyễn Thanh Thảo", score: 85, time: "0' 60\"" },
];

export const ExamRankScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={20} color="#083070" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bảng Xếp Hạng Bài Thi</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <MagnifyingGlassIcon size={18} color="#B9D2FA" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên để tìm kiếm..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>Điểm: {item.score} · {item.time}</Text>
            </View>
            {item.tag === "top" && <TrophyIcon size={20} color="#1669EF" weight="bold"/>}
            {item.tag === "ngắn" && (
              <View style={styles.tagShort}>
                <Text style={styles.tagText}>Ngắn</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};
