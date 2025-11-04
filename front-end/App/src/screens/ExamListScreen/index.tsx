import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import {
  CaretLeft,
  FunnelSimple,
  MagnifyingGlass,
  Clock,
  Student,
  Check,
} from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { getSubjectTagStyle } from "../../utils/getSubjectTagStyle";
import { styles } from "./index.styles";
import { SUBJECTS } from "../../constants/subjects";
import RNModal from "react-native-modal";
import { getExams } from "../../api/exam";


export default function ExamListScreen() {
  const navigation = useNavigation();

  // --- Tabs ---
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing");

  // --- Data ---
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Filter states ---
  const [selectedTime, setSelectedTime] = useState<"newest" | "oldest" | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  // --- Modal temp states ---
  const [showFilter, setShowFilter] = useState(false);
  const [tempTime, setTempTime] = useState<"newest" | "oldest" | null>(null);
  const [tempSubjects, setTempSubjects] = useState<string[]>([]);

  // --- Fetch exams ---
  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        status: activeTab,
        sort: selectedTime ?? undefined,
        subjectCodes: selectedSubjects.length > 0 ? selectedSubjects : undefined,
        name: searchText ?? undefined,
        currentClassCode: "CLASS_11",
        page: 1,
        limit: 10,
      };
      console.log("params", params);
      const res = await getExams(params);
      setExams(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách bài thi:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedTime, selectedSubjects, searchText]);

  useEffect(() => {
    fetchExams();
  }, [activeTab, selectedTime, selectedSubjects]);

  // --- Handle tab change ---
  const handleTabChange = (tab: "ongoing" | "upcoming") => {
    setActiveTab(tab);
    setSelectedTime(null);
    setSelectedSubjects([]);
    setSearchText("");
  };

  // --- Hàm handleSearch ---
  const handleSearch = () => {
    fetchExams();
  };

  // --- Handle search with debounce ---
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  // --- Modal filter ---
  const openFilterModal = () => {
    setTempTime(selectedTime);
    setTempSubjects([...selectedSubjects]);
    setShowFilter(true);
  };
  const toggleTempSubject = (code: string) => {
    setTempSubjects((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };
  const handleResetModal = () => {
    setTempTime(null);
    setTempSubjects([]);
  };
  const handleApply = () => {
    setSelectedTime(tempTime);
    setSelectedSubjects(tempSubjects);
    setShowFilter(false);
  };

  // --- Render exam item ---
  const renderExamItem = ({ item }: { item: any }) => {
    const subjectCode = item.subject.code as keyof typeof SUBJECTS;
    const subjectInfo = SUBJECTS[subjectCode] ?? { name: "Không xác định", code: "MATH" };
    const tagStyle = getSubjectTagStyle(subjectInfo.code);
    const subjectName = subjectInfo.name;

    const now = new Date();
    const start = new Date(item.start_date);
    const end = new Date(item.end_date);
    const diffDays =
      activeTab === "ongoing"
        ? Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24))
        : Math.ceil((start.getTime() - now.getTime()) / (1000 * 3600 * 24));
    const timeText =
      activeTab === "ongoing"
        ? `Kết thúc vào ${diffDays} ngày`
        : `Bắt đầu sau ${diffDays} ngày`;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Image source={{ uri: item.image || undefined }} style={styles.thumbnail} />
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.title}>{item.name ?? ""}</Text>

          <View style={styles.timeRow}>
            <Clock size={14} color="#5D697E" />
            <Text style={styles.time}>{timeText}</Text>

            {activeTab === "ongoing" && (
              <View style={styles.participantRow}>
                <Student size={16} color="#6B7280" weight="duotone" />
                <Text style={styles.participantText}>{item.participants?.toString() ?? "0"}</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomRow}>
            <View style={[styles.subjectTag, { backgroundColor: tagStyle.backgroundColor }]}>
              <Text style={[styles.subjectText, { color: tagStyle.color }]}>{subjectName}</Text>
            </View>

            {activeTab === "ongoing" ? (
              <TouchableOpacity style={styles.joinBtn}>
                <Text style={styles.joinText}>Vào thi</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.remindBtn}>
                <Text style={styles.remindText}>Nhắc tôi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CaretLeft size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thi Thử</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ongoing" && styles.activeTab]}
          onPress={() => handleTabChange("ongoing")}
        >
          <Text style={[styles.tabText, activeTab === "ongoing" && styles.activeTabText]}>
            Đang diễn ra
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => handleTabChange("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
            Sắp diễn ra
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={handleSearch}>
          <MagnifyingGlass size={18} color="#B9D2FA" />
        </TouchableOpacity>
        <TextInput
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearchTextChange}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={openFilterModal}>
          <FunnelSimple size={18} color="#1669EF" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Exam list */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>Đang tải...</Text>
      ) : (
        <FlatList
          data={exams}
          keyExtractor={(item) => item._id}
          renderItem={renderExamItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Modal filter */}
      <RNModal
        isVisible={showFilter}
        onBackdropPress={() => setShowFilter(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "80%" }}>
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#ccc" }} />
          </View>

          <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "600", color: "#A2ADBF", marginBottom: 10 }}>
            BỘ LỌC
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.filterSectionTitle}>Thời gian thi</Text>
            {[
              { label: "Ưu tiên mới nhất", value: "newest" as "newest" },
              { label: "Ưu tiên cũ nhất", value: "oldest" as "oldest" },
            ].map((opt) => (
              <TouchableOpacity key={opt.value} style={styles.filterOption} onPress={() => setTempTime(opt.value)}>
                <Text style={styles.filterOptionText}>{opt.label}</Text>
                {tempTime === opt.value && <Check size={16} color="#1669EF" weight="bold" />}
              </TouchableOpacity>
            ))}

            <Text style={styles.filterSectionTitle}>Môn học</Text>
            {Object.values(SUBJECTS).map((subj) => {
              const tagStyle = getSubjectTagStyle(subj.code);
              return (
                <TouchableOpacity key={subj.code} style={styles.filterOption} onPress={() => toggleTempSubject(subj.code)}>
                  <Text style={[styles.filterOptionText, { color: tagStyle.color || "#374151" }]}>{subj.name}</Text>
                  {tempSubjects.includes(subj.code) && <Check size={16} color="#1669EF" weight="bold" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleResetModal}>
              <Text style={styles.resetText}>Thiết Lập Lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Áp Dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </View>
  );
}
