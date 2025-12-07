export const a = '1';
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { ArrowRight, CaretLeft } from "phosphor-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { ConfirmModal } from "../../components/ConfirmModal";
import { getExamQuestions, submitExam } from "../../api/exam";

type RouteProps = RouteProp<RootStackParamList, "ExamDoScreen">;

type Answer = {
  _id: string;
  question_id: string;
  description: string;
  image?: string | null;
  is_correct: boolean;
  explanation?: string;
};

type Question = {
  id: string;
  text: string;
  image?: string;
  options: string[];
  correctAnswer?: number;
  answers: Answer[];
};

export default function ExamDoScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { examId } = route.params;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number | null }>({});
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalData, setModalData] = useState<any>({ visible: false });

  const selectedAnswersRef = useRef<{ [key: string]: number | null }>({});
  const timeStartRef = useRef<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);;
  const scrollViewRef = useRef<ScrollView>(null);

  const DOT_WIDTH = 35;
  const DOT_MARGIN = 4;
  const SCROLL_OFFSET = 20;

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getExamQuestions(examId);

        if (data.exam?.duration) {
          setDuration(data.exam.duration);
          setTimeLeft(data.exam.duration * 60);
        }

        const mapped = data.questions.map((q: any) => ({
          id: q._id,
          text: q.description,
          image: q.image || undefined,
          options: q.answers?.map((a: any) => a.description),
          correctAnswer: q.answers.findIndex((a: any) => a.is_correct),
          answers: q.answers,
        }));
        setQuestions(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examId]);

  const currentQuestion = questions[currentIndex];

  // Update ref khi state selectedAnswers thay đổi
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // Scroll pagination
  useEffect(() => {
    if (scrollViewRef.current) {
      const x = currentIndex * (DOT_WIDTH + DOT_MARGIN * 2) - SCROLL_OFFSET;
      scrollViewRef.current.scrollTo({ x: x >= 0 ? x : 0, y: 0, animated: true });
    }
  }, [currentIndex]);

  // Timer chỉ bắt đầu khi questions đã load
  useEffect(() => {
    if (questions.length === 0) return; // chưa có câu hỏi => không chạy

    const now = new Date();
    timeStartRef.current = now; // lưu ref

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [questions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSelectOption = (index: number) => {
    setSelectedAnswers(prev => {
      const newSelected = { ...prev, [currentQuestion.id]: index };
      selectedAnswersRef.current = newSelected; // update ref ngay
      return newSelected;
    });
    setSkippedQuestions(prev => prev.filter(id => id !== currentQuestion.id));
  };

  const handleSkip = () => {
    if (!skippedQuestions.includes(currentQuestion.id)) {
      setSkippedQuestions(prev => [...prev, currentQuestion.id]);
    }
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion.id] === undefined) {
      setModalData({
        visible: true,
        title: "Cảnh báo",
        content: "Bạn chưa chọn câu trả lời, không thể sang câu tiếp theo!",
        cancelText: "Đóng",
        isButtonOk: false,
        type: "warning",
        onCancel: () => setModalData({ visible: false }),
      });
      return;
    }
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handleBack = () => {
    setModalData({
      visible: true,
      title: "Thoát Bài Thi",
      content: "Dữ liệu sẽ không được lưu. Bạn có chắc muốn thoát bài thi?",
      cancelText: "Tiếp Tục Làm",
      confirmText: "Thoát",
      onCancel: () => setModalData({ visible: false }),
      onConfirm: () => navigation.navigate("ExamListScreen" as never),
      type: "warning",
    });
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => selectedAnswers[q.id] === undefined);

    if (unanswered.length > 0) {
      setModalData({
        visible: true,
        title: "Chưa hoàn thành",
        content: `Bạn còn ${unanswered.length} câu chưa trả lời. Bạn có chắc muốn nộp bài?`,
        cancelText: "Tiếp tục làm",
        confirmText: "Nộp bài",
        onCancel: () => setModalData({ visible: false }),
        onConfirm: () => handleSubmitConfirm(),
        type: "warning",
      });
    } else {
      setModalData({
        visible: true,
        title: "Nộp Bài Thi",
        content: "Bạn có chắc muốn nộp bài thi này?",
        cancelText: "Hủy",
        confirmText: "Nộp Bài",
        onCancel: () => setModalData({ visible: false }),
        onConfirm: () => handleSubmitConfirm(),
      });
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitConfirm();
  };

  const handleSubmitConfirm = async () => {
    setModalData({ visible: false });
    setSubmitting(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);

      console.log('questions', questions)
      console.log('selectedAnswersRef.current', selectedAnswersRef.current)
      const answersPayload = questions.map(q => {
        const selectedIndex = selectedAnswersRef.current[q.id]; // <-- luôn lấy ref
        console.log('selectedIndex', selectedIndex)
        if (selectedIndex == null) return { answer_question_id: null, is_correct: false };
        const selectedAnswer = q.answers[selectedIndex];
        return {
          answer_question_id: selectedAnswer?._id ?? null,
          is_correct: selectedAnswer?.is_correct ?? false,
        };
      });

      const payload = {
        exam_id: examId,
        user_id: userData.user.id,
        answers: answersPayload,
        time_start: timeStartRef.current?.toISOString() ?? new Date().toISOString(),
        time_end: new Date().toISOString(),
      };

      console.log("payload", payload);

      await submitExam(payload);

      navigation.navigate("ExamResultScreen", {
        examId,
        userId: userData.user.id,
      });
    } catch (err) {
      console.error(err);
      setModalData({
        visible: true,
        title: "Lỗi",
        content: "Không nộp được bài thi, vui lòng thử lại!",
        cancelText: "Đóng",
        onCancel: () => setModalData({ visible: false }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải câu hỏi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack}>
            <CaretLeft size={20} color="#083070" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitBtn}>{submitting ? "Đang nộp..." : "NỘP BÀI"}</Text>
        </TouchableOpacity>
      </View>

      {/* Question */}
      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Câu {currentIndex + 1}: {currentQuestion.text}
          </Text>
          {currentQuestion.image && (
            <Image source={{ uri: currentQuestion.image }} style={styles.image} />
          )}
          {currentQuestion.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionBtn,
                selectedAnswers[currentQuestion.id] === idx && styles.optionSelected,
              ]}
              onPress={() => handleSelectOption(idx)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswers[currentQuestion.id] === idx && styles.optionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Navigation & Pagination */}
      <View style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
        <View style={styles.navButtons}>
          <TouchableOpacity style={[styles.navBtn, styles.skipBtn]} onPress={handleSkip}>
            <Text style={[styles.navBtnText, styles.skipBtnText]}>BỎ QUA</Text>
          </TouchableOpacity>

          {currentIndex < questions.length - 1 && (
            <TouchableOpacity style={[styles.navBtn, styles.nextBtn]} onPress={handleNext}>
              <Text style={styles.navBtnText}>CÂU TIẾP THEO</Text>
              <ArrowRight size={20} color="#fff" weight="bold" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pagination}
          ref={scrollViewRef}
        >
          {questions.map((q, idx) => {
            const isSkipped = skippedQuestions.includes(q.id);
            const isAnswered = selectedAnswers[q.id] !== undefined;
            return (
              <TouchableOpacity
                key={q.id}
                style={[
                  styles.pageDot,
                  idx === currentIndex && styles.pageDotActive,
                  isAnswered && styles.pageDotAnswered,
                  isSkipped && { backgroundColor: "#FFD580", borderColor: "#FFA500" },
                  { marginHorizontal: DOT_MARGIN },
                ]}
                onPress={() => setCurrentIndex(idx)}
              >
                <Text style={styles.pageDotText}>{idx + 1}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ConfirmModal
        visible={modalData.visible}
        title={modalData.title ?? ""}
        content={modalData.content ?? ""}
        cancelText={modalData.cancelText ?? "Hủy"}
        confirmText={modalData.confirmText ?? "Xác Nhận"}
        onCancel={modalData.onCancel ?? (() => { })}
        onConfirm={modalData.onConfirm ?? (() => { })}
        type={modalData.type}
        isButtonOk={modalData.isButtonOk ?? true}
      />
    </View>
  );
}
