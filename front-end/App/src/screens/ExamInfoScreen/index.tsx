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
        {/* <ShortInfoExam
          exam={{ id: examId }}
        /> */}
        <ShortInfoExam
          exam={examInfo}
        />
        {/* Hình ảnh */}
        {/* <Image source={{ uri: examInfo.image }} style={styles.image} /> */}

        {/* Row trạng thái */}
        {/* <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Clock size={16} color="#0C4299" weight="fill" />
            <Text style={styles.statusText}>{examInfo.duration} phút</Text>
          </View>
          <View style={styles.statusItem}>
            <Student size={16} color="#0C4299" weight="fill" />
            <Text style={styles.statusText}>{examInfo.participants}</Text>
          </View>
          <View style={styles.statusItem}>
            <ThumbsUp size={16} color="#0C4299" weight="bold" />
            <Text style={styles.statusText}>{examInfo.likes}</Text>
          </View>
        </View> */}

        {/* Instruction box */}
        {/* <View style={styles.instructionBox}>
          <Text style={styles.subTitle}>HƯỚNG DẪN LÀM BÀI KIỂM TRA</Text>

          {[
            "Câu hỏi bao gồm 4 loại là chọn 1 đáp án, chọn nhiều đáp án, nhập văn bản trả lời và câu hỏi tham khảo không cần trả lời",
            "Thời gian làm bài kiểm tra sẽ được đếm lùi dần cho đến khi kết thúc. Bài thi sẽ kết thúc khi hết thời gian hoặc bạn chọn nộp bài",
            "Hãy bỏ qua câu hỏi khó, bạn vẫn có thể quay lại làm tiếp khi còn thời gian",
          ].map((text, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{text}</Text>
            </View>
          ))}
        </View> */}
        <InstructionDoExam />

        {/* Nút bắt đầu */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ExamDoScreen", {
              examId
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
