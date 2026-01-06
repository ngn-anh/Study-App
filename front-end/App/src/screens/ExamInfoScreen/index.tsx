import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { CaretLeft, ArrowRight } from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { getExamInfo } from "../../api/exam";
import InstructionDoExam from "../../components/InstructionDoExam";
import ShortInfoExam from "../../components/ShortInfoExam";
import { Exam } from "../../types/typeObj";

type RouteProps = RouteProp<RootStackParamList, "ExamInfoScreen">;

export default function ExamInfoScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { examId } = route.params;

  const [examInfo, setExamInfo] = useState<Exam | null>(null);

  useEffect(() => {
    const fetchExamInfo = async () => {
      try {
        const data = await getExamInfo(examId);
        console.log("Thông tin bài thi:", data);
        setExamInfo(data);
      } catch (err) {
        console.error("Không lấy được thông tin bài thi:", err);
      }
    };
    fetchExamInfo();
  }, [examId]);

  if (!examInfo) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin bài thi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={20} color="#083070" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{examInfo?.name}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <ShortInfoExam
          exam={examInfo}
        />

        <InstructionDoExam />

        {/* Nút bắt đầu */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExamDoScreen", {
              examId,
              reverseQuestion: false,
              reverseAnswer: false,
              durationSetting: examInfo?.duration ?? null,
            })
          }
        >
          <LinearGradient
            colors={["#0C4299", "#041633"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startBtn}
          >
            <ArrowRight size={18} color="#fff" weight="bold" style={{ marginRight: 6 }} />
            <Text style={styles.startText}>Bắt Đầu</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
