import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  CaretLeftIcon,
  PencilSimpleLineIcon,
  ClockIcon,
  CalendarCheckIcon,
  NoteIcon,
} from "phosphor-react-native";
import { useNavigation, RouteProp, NavigationProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";

type ScheduleDetailRouteProp = RouteProp<RootStackParamList, "ScheduleDetail">;

const mockData = [
  {
    id: "1",
    title: "Lịch kiểm tra giữa kỳ 1",
    dueDate: "2025-11-07T12:00:00",
    note: "Học hành chăm chỉ bạn sẽ có tất cả, thành công không đến với kẻ lười nhác...",
  },
  {
    id: "2",
    title: "Lịch thi thử đợt 1",
    dueDate: "2025-11-10T09:00:00",
    note: "Hãy ôn luyện kỹ trước khi thi!",
  },
];

const ScheduleDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ScheduleDetailRouteProp>();
  const { id } = route.params;

  const [schedule, setSchedule] = useState<any>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const found = mockData.find((item) => item.id === id);
    if (found) {
      setSchedule(found);
      setRemaining(new Date(found.dueDate).getTime() - Date.now());
    }
  }, [id]);

  useEffect(() => {
    if (!schedule) return;
    const timer = setInterval(() => {
      setRemaining(new Date(schedule.dueDate).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [schedule]);

  if (!schedule) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy lịch hẹn.</Text>
      </View>
    );
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <CaretLeftIcon size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: "#083070", marginLeft: 8 }]}>
            Lịch hẹn
          </Text>
        </View>
        <TouchableOpacity  onPress={() => navigation.navigate("CreateUpdateSchedule", { id })}>
          <PencilSimpleLineIcon size={22} color="#275BAE" weight="fill" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <LinearGradient
        colors={["#0C4299", "#708EBD"]}
        style={{ flex: 1, padding: 16 }}
      >
        {/* Dòng ngoài card */}
        <Text
          style={{
            color: "#fff",
            fontWeight: "500", 
            fontSize: 20, 
            marginBottom: 50, 
            marginTop: 80, 
            textAlign: "center", 
            letterSpacing:1.3,
          }}
        >
          TỪ NAY ĐẾN NGÀY DỰ KIẾN CÒN
        </Text>

        {/* CARD THÔNG TIN */}
        <LinearGradient
          colors={["#0C4299", "#041633"]}
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* Title với icon CalendarCheck */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <CalendarCheckIcon size={26} color="#fff" weight="fill" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 8 }}>
              {schedule.title}
            </Text>
          </View>

          {/* Countdown */}
          <View style={{ ...styles.timerContainer, marginVertical: 16 }}>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{Math.max(days, 0)}</Text>
              <Text style={styles.timeLabel}>NGÀY</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{Math.max(hours, 0)}</Text>
              <Text style={styles.timeLabel}>GIỜ</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{Math.max(minutes, 0)}</Text>
              <Text style={styles.timeLabel}>PHÚT</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{Math.max(seconds, 0)}</Text>
              <Text style={styles.timeLabel}>GIÂY</Text>
            </View>
          </View>

          {/* Ngày dự kiến */}
          <View style={styles.dateRow}>
            <ClockIcon size={18} color="#fff" />
            <Text style={styles.dateText}>
              Ngày dự kiến: {new Date(schedule.dueDate).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        </LinearGradient>

        {/* GHI CHÚ với NoteIcon trên và căn giữa */}
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <NoteIcon size={26} color="#fff" style={{ marginBottom: 6 }} />
          <Text style={[styles.quoteText, { textAlign: "center" }]}>{schedule.note}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ScheduleDetailScreen;
