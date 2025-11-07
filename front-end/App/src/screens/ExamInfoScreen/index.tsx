import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { CaretLeft, Clock, Student, Heart, ArrowRight, ThumbsUp } from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";

type RouteProps = RouteProp<RootStackParamList, "ExamInfoScreen">;

export default function ExamInfoScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { examId } = route.params;

  // 🔹 Tạm fix cứng dữ liệu bài thi
  const examInfo = {
    name: "Đề Thi Thử Toán THPT Quốc Gia 2025",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_g0nAjaKp3XDubou5iKP1-JMtwANQunsKAw&s",
    participants: 245,
    likes: 120,
    status: "Đang diễn ra",
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CaretLeft size={20} color="#083070" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{examInfo.name}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Hình ảnh */}
        <Image source={{ uri: examInfo.image }} style={styles.image} />

        {/* Row trạng thái */}
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Clock size={16} color="#0C4299" weight="fill" />
            <Text style={styles.statusText}>{examInfo.status}</Text>
          </View>
          <View style={styles.statusItem}>
            <Student size={16} color="#0C4299" weight="fill" />
            <Text style={styles.statusText}>{examInfo.participants}</Text>
          </View>
          <View style={styles.statusItem}>
            <ThumbsUp  size={16} color="#0C4299" weight="bold" />
            <Text style={styles.statusText}>{examInfo.likes}</Text>
          </View>
        </View>

        {/* Instruction box */}
        <View style={styles.instructionBox}>
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
        </View>

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
