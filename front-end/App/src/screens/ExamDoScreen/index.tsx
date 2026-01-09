import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { ArrowRight, CaretLeft } from "phosphor-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { ConfirmModal } from "../../components/ConfirmModal";
import { submitExam } from "../../api/exam";
import { getQuestionsByExam } from "../../api/question";
import { formatTime } from "../../utils/time";
import { convertLatexToText } from "../../utils/latexToText";
import { SUBMITTED_EXAM, TYPE_EXAM } from "../../constants";

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
  const {
    examId,
    reverseQuestion: reverseQuestion,
    reverseAnswer: reverseAnswer,
    durationSetting: durationSetting,
  } = route.params;
  console.log("loanhtm route.params: ", route.params);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [exam, setExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
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
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const DOT_WIDTH = 35;
  const DOT_MARGIN = 4;
  const SCROLL_OFFSET = 20;

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await getQuestionsByExam(
        examId,
        reverseQuestion,
        reverseAnswer
      );
      const data = res.data;
      console.log("loanhtm params do Exam: ", examId,
        reverseQuestion,
        reverseAnswer
      );

      setExam(data.exam);

      if (durationSetting !== null) {
        setDuration(data.exam.duration);
        setTimeLeft(durationSetting !== null ? (data.exam.duration * 60) : null);
      }
      console.log("loanhtm data do Exam: ", data);
      const mapped = data.questions.map((q: any) => ({
        id: q._id,
        text: q.description,
        image: q.image || undefined,
        options: q.answers?.map((a: any) => a.description),
        correctAnswer: q.answers.findIndex((a: any) => a.is_correct),
        answers: q?.answers ?? [],
      }));
      setQuestions(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [examId, reverseQuestion, reverseAnswer]);

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


  useEffect(() => {
    if (questions.length === 0) return;

    const now = new Date();
    timeStartRef.current = now;

    // clear tất cả timer cũ
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }

    // ⏱ CÓ GIỚI HẠN → ĐẾM LÙI
    if (durationSetting !== null && timeLeft !== null) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // ♾ KHÔNG GIỚI HẠN → ĐẾM TIẾN
    if (durationSetting === null) {
      setTimeElapsed(0);
      elapsedTimerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, [questions]);


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

  const handleGoBack = () => {
    if (Number(exam?.type) == TYPE_EXAM.DE_LUYEN) {
      navigation.navigate("PracticeExamDetailScreen", {
        examId,
      });
    } else {
      navigation.navigate("ExamListScreen" as never)
    }
  }

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
      title: "Thoát bài thi",
      content: "Dữ liệu sẽ không được lưu. Bạn có chắc muốn thoát bài thi?",
      cancelText: "Tiếp tục làm",
      confirmText: "Thoát",
      onCancel: () => setModalData({ visible: false }),
      onConfirm: () => handleGoBack(),
      type: "warning",
    });
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => selectedAnswers[q.id] === undefined);
    console.log("loanhtm submit exam");
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

    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }

    try {
      const userDataStr = await AsyncStorage.getItem("userData");
      if (!userDataStr) throw new Error("Không tìm thấy thông tin người dùng");
      const userData = JSON.parse(userDataStr);

      const answersPayload = questions.map(q => {
        const selectedIndex = selectedAnswersRef.current[q.id];
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

      await submitExam(payload);

      if (Number(exam?.type) == TYPE_EXAM.THI_THU) {
        navigation.navigate("ExamResultScreen", {
          examId,
          userId: userData.user.id,
        });
      } else if (Number(exam?.type) == TYPE_EXAM.DE_LUYEN) {
        navigation.navigate("PracticeExamDetailScreen", {
          examId,
          submitted: SUBMITTED_EXAM.DE_LUYEN,
        });
      }


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
      
          <Text style={styles.timerText}>
            {durationSetting !== null
              ? formatTime(timeLeft ?? 0)
              : formatTime(timeElapsed)}
          </Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitBtn}>{submitting ? "Đang nộp..." : "NỘP BÀI"}</Text>
        </TouchableOpacity>
      </View>

      {/* Question */}
      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            Câu {currentIndex + 1}: {convertLatexToText(currentQuestion.text)}
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
                {convertLatexToText(opt)}
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
