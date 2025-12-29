import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useRoute, RouteProp, NavigationProp, useNavigation } from "@react-navigation/native";
import { styles } from "./index.styles";
import { getExamDetailResult, Question } from "../../api/examResult";
import { RootStackParamList } from "../../types/data";
import { CaretLeft, CheckCircle, XCircle, MinusCircle } from "phosphor-react-native";

type RouteProps = RouteProp<RootStackParamList, "ExamDetailResultScreen">;

export default function ExamDetailResultScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { examResultId } = route.params;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExamDetailResult(examResultId);
        console.log("ExamDetailResult data:", JSON.stringify(data, null, 2));
        setQuestions(data.questions);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examResultId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0C4299" />
      </View>
    );
  }

  const renderStatusIcon = (q: Question) => {
    if (q.userAnswer === undefined)
      return <MinusCircle size={20} color="#999" weight="bold" style={{ marginTop: 2 }}/>; // chưa làm
    if (q.userAnswer === q.correctAnswer)
      return <CheckCircle size={20} color="#28a745" weight="bold" style={{ marginTop: 2 }}/>; // đúng
    return <XCircle size={20} color="#dc3545" weight="bold" style={{ marginTop: 2 }}/>; // sai
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <CaretLeft size={20} color="#083070" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Bài Thi</Text>
      </View>

      <ScrollView style={styles.container}>
        {questions.map((q, idx) => {
          const userAnswer = q.userAnswer;
          const correctAnswerIndex = q.correctAnswer;
          const isUnanswered = userAnswer === undefined;

          return (
            <View key={q.id} style={styles.questionCard}>
              {/* Tiêu đề câu hỏi + icon trạng thái */}
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10 }}>
                {renderStatusIcon(q)}
                <Text style={{ fontSize: 16, fontWeight: "600", flex: 1, marginLeft:8, color:"#083070" }}>
                   {`Câu ${idx + 1}: ${String(q.text ?? "")}`}
                </Text>
              
              </View>

              {q.image && <Image source={{ uri: q.image }} style={styles.image} />}

              {/* Các lựa chọn */}
              {q.options.map((opt, i) => {
                const isUserChoice = userAnswer === i;
                const isCorrect = correctAnswerIndex === i;

                let optionStyle: StyleProp<ViewStyle> = [styles.optionRow];
                if (isCorrect) optionStyle.push(styles.correctOption); // luôn highlight đáp án đúng
                if (isUserChoice && !isCorrect) optionStyle.push(styles.wrongOption); // nếu chọn sai

                return (
                  <View key={i} style={optionStyle}>
                    <Text style={styles.optionText}>{opt}</Text>
                  </View>
                );
              })}

              {/* Giải thích nếu trả lời sai */}
              {typeof correctAnswerIndex === "number" &&
                userAnswer !== correctAnswerIndex && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>Giải thích:</Text>
                    <Text style={styles.explanationText}>
                      {String(q.answers?.[correctAnswerIndex]?.explanation || "Không có giải thích.")}
                    </Text>
                  </View>
                )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
