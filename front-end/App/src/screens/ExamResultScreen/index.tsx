import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { styles } from "./index.styles";
import {
  ArrowLeftIcon,
  CaretLeft,
  HouseIcon,
  NoteIcon,
  TrophyIcon,
  LightbulbIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  MinusCircleIcon,
} from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { ExamResultDetail, getExamResultDetail } from "../../api/examResult";

type RouteProps = RouteProp<RootStackParamList, "ExamResultScreen">;

export const ExamResultScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { examId, userId } = route.params; // giả sử bạn truyền examId & userId từ route
  const [result, setResult] = useState<ExamResultDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await getExamResultDetail(userId, examId);
        setResult({
          examResultId: data.exam_result_id,
          total_correct: data.total_correct,
          total_question: data.total_question,
          total_wrong: data.total_wrong,
          total_not_done: data.total_not_done,
          durationSec: data.durationSec,
          duration_text: data.duration_text
        });
      } catch (err) {
        console.error("Không lấy được kết quả:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [examId, userId]);

  if (loading || !result) {
    return (
      <View style={styles.container}>
        <Text>Đang tải kết quả...</Text>
      </View>
    );
  }

  const { total_correct, total_question, total_wrong, total_not_done, duration_text, durationSec } = result;
  const percent = Math.round((total_correct / total_question) * 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("ExamListScreen")}>
            <CaretLeft size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết Quả Thi</Text>
        </View>
      </View>

      {/* Kết quả biểu đồ */}
      <View style={styles.resultContainer}>
        <AnimatedCircularProgress
          size={140}
          width={8}
          fill={percent}
          tintColor="#083070"
          backgroundColor="#EAEAEA"
          rotation={0}
          lineCap="round"
        >
          {() => <Text style={styles.resultPercent}>{percent}%</Text>}
        </AnimatedCircularProgress>
        <Text style={styles.resultMessage}>🎉 Chúc mừng! Bạn đã hoàn thành bài thi</Text>
      </View>

      {/* 5 ô thống kê */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <LightbulbIcon size={22} color="#F4C430" weight="bold" />
          <Text style={styles.statValue}>{total_question}</Text>
          <Text style={styles.statLabel}>Tổng cộng</Text>
        </View>
        <View style={styles.statBox}>
          <CheckIcon size={22} color="#1BA803" weight="bold" />
          <Text style={styles.statValue}>{total_correct}</Text>
          <Text style={styles.statLabel}>Câu đúng</Text>
        </View>
        <View style={styles.statBox}>
          <XIcon size={22} color="#E53935" weight="bold" />
          <Text style={styles.statValue}>{total_wrong}</Text>
          <Text style={styles.statLabel}>Câu sai</Text>
        </View>
        <View style={styles.statBox}>
          <MinusCircleIcon size={22} color="#999999" weight="bold" />
          <Text style={styles.statValue}>{total_not_done}</Text>
          <Text style={styles.statLabel}>Chưa làm</Text>
        </View>
        <View style={styles.statBox}>
          <ClockIcon size={22} color="#0C4299" weight="bold" />
          <Text style={styles.statValue}>{duration_text}</Text>
          <Text style={styles.statLabel}>Thời gian</Text>
        </View>
      </View>

      {/* Buttons */}
      <LinearGradient colors={["#0C4299", "#041633"]} style={styles.button}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate("MainTabs" as never)}
        >
          <View style={styles.buttonContent}>
            <HouseIcon size={22} color="#fff" />
            <Text style={styles.buttonText}>Trang Chủ</Text>
          </View>
          <ArrowLeftIcon
            size={20}
            color="#fff"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={["#0C4299", "#041633"]} style={styles.button}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() =>
            navigation.navigate("ExamDetailResultScreen", { examResultId: result.examResultId })
          }
        >
          <View style={styles.buttonContent}>
            <NoteIcon size={22} color="#fff" />
            <Text style={styles.buttonText}>Chi Tiết Kết Quả</Text>
          </View>
          <ArrowLeftIcon
            size={20}
            color="#fff"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={["#0C4299", "#041633"]} style={styles.button}>
        <TouchableOpacity
          style={styles.buttonInner}
          onPress={() => navigation.navigate("ExamRankScreen", { userId, examId })}
        >
          <View style={styles.buttonContent}>
            <TrophyIcon size={22} color="#fff" />
            <Text style={styles.buttonText}>
              Chi Tiết Bảng Xếp Hạng Bài Thi
            </Text>
          </View>
          <ArrowLeftIcon
            size={20}
            color="#fff"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
