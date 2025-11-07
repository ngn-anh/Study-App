import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { CaretLeft } from "phosphor-react-native";
import { RootStackParamList } from "../../types/data";
import { styles } from "./index.styles";
import { ConfirmModal } from "../../components/ConfirmModal";

type RouteProps = RouteProp<RootStackParamList, "ExamDoScreen">;

type Question = {
  id: number;
  text: string;
  image?: string;
  options: string[];
  correctAnswer?: number;
};

export default function ExamDoScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { examId } = route.params;

  const duration = 15;
  const sampleQuestions: Question[] = [
    { id: 1, text: "Hình dưới đây là con gì?", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlpfC7Xq14JaD8Zdf34Y7Jhi2vw0mBCJfhA&s", options: ["Hình con lợn", "Hình con mèo", "Hình con chó", "Hình con gà"], correctAnswer: 1 },
    { id: 2, text: "Kết quả của phép tính 5 + 7 là bao nhiêu?", options: ["10", "11", "12", "13"], correctAnswer: 2 },
    { id: 3, text: "Đồ thị của hàm số y = x² là đường gì?", options: ["Đường tròn", "Đường thẳng", "Parabol", "Elip"], correctAnswer: 2 },
  ];

  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | null }>({});

  const [modalData, setModalData] = useState<{
    visible: boolean;
    title?: string;
    content?: string;
    cancelText?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    type?: 'warning' | 'confirm';
  }>({ visible: false });

  const currentQuestion = sampleQuestions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSelectOption = (index: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
    }));
  };

  const handleSkip = () => {
    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
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
      type: 'warning'
    });
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const unansweredCount = sampleQuestions.length - answeredCount;

    if (unansweredCount > 0) {
      setModalData({
        visible: true,
        title: "Nộp Bài Thi Thử",
        content: `Bạn còn ${unansweredCount} câu chưa làm. Bạn có chắc muốn nộp bài thi?`,
        cancelText: "Tiếp Tục Làm",
        confirmText: "Nộp Bài",
        onCancel: () => setModalData({ visible: false }),
        onConfirm: () => handleSubmitConfirm(),
        type: 'warning'
      });
    } else {
      setModalData({
        visible: true,
        title: "Nộp Bài Thi Thử",
        content: "Bạn chắc chắn muốn nộp bài thi này?",
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

  const handleSubmitConfirm = () => {
    console.log("Bài làm:", selectedAnswers);
    setModalData({ visible: false });
    navigation.navigate("ExamResultScreen" as never);
  };

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

        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submitBtn}>NỘP BÀI</Text>
        </TouchableOpacity>
      </View>

      {/* Question */}
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

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>BỎ QUA</Text>
      </TouchableOpacity>

      {/* Pagination */}
      <View style={styles.pagination}>
        {sampleQuestions.map((q, idx) => (
          <TouchableOpacity
            key={q.id}
            style={[
              styles.pageDot,
              idx === currentIndex && styles.pageDotActive,
              selectedAnswers[q.id] !== undefined && styles.pageDotAnswered,
            ]}
            onPress={() => setCurrentIndex(idx)}
          >
            <Text style={styles.pageDotText}>{idx + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ConfirmModal
        visible={modalData.visible}
        title={modalData.title ?? ""}
        content={modalData.content ?? ""}
        cancelText={modalData.cancelText ?? "Hủy"}
        confirmText={modalData.confirmText ?? "Xác Nhận"}
        onCancel={modalData.onCancel ?? (() => {})}
        onConfirm={modalData.onConfirm ?? (() => {})}
        type={modalData.type}
        />
    </View>
  );
}
