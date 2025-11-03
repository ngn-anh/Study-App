import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import {
  CaretLeft,
  FunnelSimple,
  MagnifyingGlass,
  Clock,
  Student,
  CheckCircle,
  Check,
} from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { getSubjectTagStyle } from "../../utils/getSubjectTagStyle";
import { styles } from "./index.styles";
import { SUBJECTS } from "../../constants/subjects";
import RNModal from "react-native-modal";

export default function ExamListScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing");

  // 👉 Bộ lọc
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (code: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const handleReset = () => {
    setSelectedTime(null);
    setSelectedSubjects([]);
  };

  const handleApply = () => {
    setShowFilter(false);
    console.log("Filter applied:", { selectedTime, selectedSubjects });
  };

  const timeOptions = [
    { label: "Ưu tiên mới nhất", value: "newest" },
    { label: "Ưu tiên cũ nhất", value: "oldest" },
  ];

  const exams =
    activeTab === "ongoing"
      ? [
          {
            id: 1,
            title: "Thi thử giữa kì 2",
            subjectCode: "MATH",
            time: "Kết thúc vào 3 ngày",
            participants: 22,
          },
          {
            id: 2,
            title: "Thi thử giữa kì 2",
            subjectCode: "LITERATURE",
            time: "Kết thúc vào 3 ngày",
            participants: 12,
          },
        ]
      : [
          {
            id: 3,
            title: "Thi thử giữa kì 2",
            subjectCode: "ENGLISH",
            time: "Bắt đầu vào 3 ngày",
          },
        ];

  const renderExamItem = ({ item }: { item: any }) => {
    const subjectCode = item.subjectCode as keyof typeof SUBJECTS;
    const tagStyle = getSubjectTagStyle(subjectCode);
    const subjectName = SUBJECTS[subjectCode].name;

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Image
            source={require("../../assets/images/subject.png")}
            style={styles.thumbnail}
          />
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.timeRow}>
            <Clock size={14} color="#5D697E" />
            <Text style={styles.time}>{item.time}</Text>

            {activeTab === "ongoing" && (
              <View style={styles.participantRow}>
                <Student size={16} color="#6B7280" weight="duotone" />
                <Text style={styles.participantText}>
                  {item.participants}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomRow}>
            <View
              style={[
                styles.subjectTag,
                { backgroundColor: tagStyle.backgroundColor },
              ]}
            >
              <Text style={[styles.subjectText, { color: tagStyle.color }]}>
                {subjectName}
              </Text>
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
          onPress={() => setActiveTab("ongoing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ongoing" && styles.activeTabText,
            ]}
          >
            Đang diễn ra
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Sắp diễn ra
          </Text>
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <MagnifyingGlass size={18} color="#B9D2FA" />
        <TextInput
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={() => setShowFilter(true)}>
          <FunnelSimple size={18} color="#1669EF" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Danh sách bài thi */}
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExamItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal Bộ lọc */}
      <RNModal
        isVisible={showFilter}
        onBackdropPress={() => setShowFilter(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: "80%",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#ccc",
              }}
            />
          </View>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: "600",
              color: "#A2ADBF",
              marginBottom: 10,
              letterSpacing: 0.03
            }}
          >
            BỘ LỌC
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Thời gian thi */}
            <Text style={styles.filterSectionTitle}>Thời gian thi</Text>
            {timeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.filterOption}
                onPress={() => setSelectedTime(opt.value)}
              >
                <Text style={styles.filterOptionText}>{opt.label}</Text>
                {selectedTime === opt.value && (
                  <Check  size={16} color="#1669EF" weight="bold" />
                )}
              </TouchableOpacity>
            ))}

            {/* Môn học */}
            <Text style={styles.filterSectionTitle}>Môn học</Text>
            {Object.values(SUBJECTS).map((subj) => {
              const tagStyle = getSubjectTagStyle(subj.code);
              return (
                <TouchableOpacity
                  key={subj.code}
                  style={styles.filterOption}
                  onPress={() => toggleSubject(subj.code)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      { color: tagStyle.color || "#374151" },
                    ]}
                  >
                    {subj.name}
                  </Text>
                  {selectedSubjects.includes(subj.code) && (
                    <Check size={16} color="#1669EF" weight="bold" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
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
