export const a = '1';
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Image } from "react-native";
import { styles } from "./index.styles";
import { CaretLeft, MagnifyingGlassIcon, TrophyIcon, Clock } from "phosphor-react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { getExamRank } from "../../api/exam"; // import api
import { RootStackParamList } from "../../types/data";

interface RankItem {
  rank: number;
  name: string;
  avatar?: string | null;
  score: number;
  duration: number; // ms
  is_current_user: boolean;
}

type RouteProps = RouteProp<RootStackParamList, "ExamRankScreen">;

export const ExamRankScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { examId, userId } = route.params;
  const [searchName, setSearch] = useState("");
  const [rankList, setRankList] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRank();
  }, [examId, userId]);

  const fetchRank = async () => {
    try {
      setLoading(true);
      const res = await getExamRank({ examId, userId, searchName });
      setRankList(res);
    } catch (err) {
      console.error("❌ Lỗi tải bảng xếp hạng:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rankList.filter(item =>
    item.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}' ${remainingSeconds}"`;
  };

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
        <TouchableOpacity onPress={fetchRank}>
          <MagnifyingGlassIcon size={18} color="#B9D2FA" style={{ marginRight: 6 }} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập tên để tìm kiếm..."
          value={searchName}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              item.is_current_user && { borderColor: "#1669EF", borderWidth: 1 },
              { flexDirection: "row", alignItems: "center", padding: 8 }
            ]}
          >
            {/* Rank */}
            <Text style={[styles.rank, { width: 27 }]}>{item.rank}</Text>

            {/* Avatar */}
            <View style={{ marginRight: 10 }}>
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 36, height: 36, borderRadius: 18 }}
                />
              ) : (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {item.name?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Name + Score + Duration */}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                <Text style={styles.details}>Điểm: {item.score}</Text>
                <Clock size={14} color="#5D697E" style={{ marginRight: 4 }} />
                <Text style={styles.details}>{formatDuration(item.duration)}</Text>
              </View>
            </View>

            {/* Top 3 */}
            {item.rank == 1 && <Image source={require("../../assets/images/rank_1.png")} style={styles.image} />}
            {item.rank == 2 && <Image source={require("../../assets/images/rank_2.png")} style={styles.image} />}
            {item.rank == 3 && <Image source={require("../../assets/images/rank_3.png")} style={styles.image} />}
          </View>
        )}
      />
      {loading && <Text style={{ textAlign: "center", marginTop: 20 }}>Đang tải...</Text>}
      <View style={styles.block}></View>
    </View>
  );
};
