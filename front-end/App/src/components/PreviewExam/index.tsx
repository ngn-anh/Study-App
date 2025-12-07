/* --------------------------------------------------------------
   PreviewExam – hiển thị nội dung “preview” của một đề thi.
   Các phần (section) được tải từ API, có thể mở/đóng riêng.
   -------------------------------------------------------------- */
import React, { memo, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "./index.styles";
import { Answer, Exam, Question } from "../../types/typeObj";
import { getQuestionsByExam } from "../../api/question";

/* -------------------  Types nhận từ API -------------------- */
export interface Part {
    /** Tên phần (section) */
    title: string;
    /** Danh sách câu hỏi của phần */
    questions: Question[];
}

/* -------------------  Props của component ----------------- */
interface Props {
    /** Id của đề thi cần preview */
    examId: string | undefined;
}

/* -----------------------  Component ------------------------ */
const PreviewExam: React.FC<Props> = memo(({ examId }) => {
    const [parts, setParts] = useState<Part[]>([]);
    const [listSection, setListSection] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());

    /* --------------------  Xử lý dữ liệu từ API -------------------- */
    /** Nhóm danh sách câu hỏi theo trường `section` và trả về mảng Part */
    const processQuestionsData = (
        questions: Question[]
    ): { parts: Part[]; sections: string[] } => {
        if (!questions?.length) return { parts: [], sections: [] };

        const bySection: Record<string, Question[]> = {};

        questions.forEach((q) => {
            // nếu không có section => đặt “Chung”
            const sec = (q as any).section?.toString() ?? "Chung";
            if (!bySection[sec]) bySection[sec] = [];
            bySection[sec].push(q);
        });

        const sections = Object.keys(bySection);

        const parts: Part[] = sections.map((sec) => ({
            title: `Phần ${sec}`,
            questions: bySection[sec],
        }));

        return { parts, sections };
    };

    /* --------------------  Mock data (được cung cấp) -------------------- */
    // Bạn đã gửi cho chúng tôi một object có key `questions`; chúng tôi chỉ cần mảng này.
    const mockQuestions: Question[] = [
        {
            _id: "690dd86a1e4d52743251d885",
            exam_id: "6908a903bc2ae0fd775ccad6",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlpfC7Xq14JaD8Zdf34Y7Jhi2vw0mBCJfhA&s",
            description: "Đâu là thủ đô của Việt Nam?",
            difficulty: 1,
            section: 3,
            answers: [
                {
                    _id: "690dd9ca1e4d52743251d88f",
                    question_id: "690dd86a1e4d52743251d885",
                    description: "Hà Nội",
                    image: null,
                    is_correct: true,
                    explanation: "Hà Nội là thủ đô của Việt Nam từ năm 1976.",
                },
                {
                    _id: "690dd9ca1e4d52743251d890",
                    question_id: "690dd86a1e4d52743251d885",
                    description: "TP. Hồ Chí Minh",
                    image: null,
                    is_correct: false,
                    explanation:
                        "TP. Hồ Chí Minh là trung tâm kinh tế lớn nhất nước.",
                },
                {
                    _id: "690dd9ca1e4d52743251d891",
                    question_id: "690dd86a1e4d52743251d885",
                    description: "Đà Nẵng",
                    image: null,
                    is_correct: false,
                    explanation:
                        "Đà Nẵng là thành phố lớn ở miền Trung Việt Nam.",
                },
                {
                    _id: "690dd9ca1e4d52743251d892",
                    question_id: "690dd86a1e4d52743251d885",
                    description: "Huế",
                    image: null,
                    is_correct: false,
                    explanation: "Huế từng là kinh đô của triều Nguyễn.",
                },
            ],
        },
        {
            _id: "690dd86a1e4d52743251d886",
            exam_id: "6908a903bc2ae0fd775ccad6",
            image: null,
            description: "Kết quả của phép tính 15 × 3 là bao nhiêu?",
            difficulty: 1,
            section: 1,
            answers: [
                {
                    _id: "690dd9ca1e4d52743251d893",
                    question_id: "690dd86a1e4d52743251d886",
                    description: "45",
                    image: null,
                    is_correct: true,
                    explanation: "15 × 3 = 45.",
                },
                {
                    _id: "690dd9ca1e4d52743251d894",
                    question_id: "690dd86a1e4d52743251d886",
                    description: "35",
                    image: null,
                    is_correct: false,
                    explanation: "Sai, 15 × 3 không bằng 35.",
                },
                {
                    _id: "690dd9ca1e4d52743251d895",
                    question_id: "690dd86a1e4d52743251d886",
                    description: "55",
                    image: null,
                    is_correct: false,
                    explanation: "Sai, kết quả lớn hơn thực tế.",
                },
                {
                    _id: "690dd9ca1e4d52743251d896",
                    question_id: "690dd86a1e4d52743251d886",
                    description: "50",
                    image: null,
                    is_correct: false,
                    explanation: "Sai, 15 nhân 3 không thể ra số chẵn 50.",
                },
            ],
        },
        // 👉 Bạn có thể thêm bao nhiêu câu hỏi “mock” nữa ở đây.
    ];

    /* --------------------  Hàm fetch -------------------- */
    const fetchQuestions = async () => {
        /* ---- Trường hợp không có examId → dùng mock ngay ---- */
        if (!examId) {
            const { parts: p, sections: s } = processQuestionsData(mockQuestions);
            setParts(p);
            setListSection(s);
            setExpandedParts(new Set([0])); // mở phần đầu tiên mặc định
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getQuestionsByExam(examId);
            const apiData = response.data; // dữ liệu thực tế nằm trong response.data

            if (apiData?.errorCode === 0) {
                const questions: Question[] = apiData.data ?? [];

                if (questions.length === 0) {
                    // API trả về rỗng → dùng mock
                    const { parts: p, sections: s } = processQuestionsData(mockQuestions);
                    setParts(p);
                    setListSection(s);
                } else {
                    // Xử lý dữ liệu thực tế
                    const { parts: p, sections: s } = processQuestionsData(questions);
                    setParts(p);
                    setListSection(s);
                }
                setExpandedParts(new Set([0])); // mở phần đầu tiên
            } else {
                // API trả về lỗi → fallback sang mock
                console.warn("API error:", apiData?.message);
                const { parts: p, sections: s } = processQuestionsData(mockQuestions);
                setParts(p);
                setListSection(s);
                setExpandedParts(new Set([0]));
            }
        } catch (error) {
            // Lỗi kết nối, timeout … → fallback sang mock
            console.warn("Failed to fetch exam questions:", error);
            const { parts: p, sections: s } = processQuestionsData(mockQuestions);
            setParts(p);
            setListSection(s);
            setExpandedParts(new Set([0]));
        } finally {
            setLoading(false);
        }
    };

    /* --------------------  Effect -------------------- */
    useEffect(() => {
        fetchQuestions();
    }, [examId]);

    /* --------------------  Mở / Đóng phần ----------------- */
    const togglePart = (index: number) => {
        setExpandedParts((prev) => {
            const set = new Set(prev);
            set.has(index) ? set.delete(index) : set.add(index);
            return set;
        });
    };

    /* --------------------  Render ----------------- */
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={styles.accentColor?.color || "#007AFF"}
                />
            </View>
        );
    }

    if (parts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có câu hỏi nào để hiển thị</Text>
            </View>
        );
    }

    return (
        <View style={styles.previewExamContainer}>
            {/* Danh sách các phần (Section) */}
            {parts.map((part, partIdx) => {
                const isExpanded = expandedParts.has(partIdx);
                return (
                    <View key={partIdx} style={styles.partWrapper}>
                        {/* Tiêu đề phần */}
                        <TouchableOpacity
                            style={[
                                styles.partHeader,
                                isExpanded && styles.partHeaderActive,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => togglePart(partIdx)}
                            accessibilityLabel={part.title}
                            accessibilityRole="button"
                        >
                            <Text
                                style={[
                                    styles.partTitle,
                                    isExpanded && styles.partTitleActive,
                                ]}
                            >
                                {part.title}
                            </Text>
                            <Text
                                style={[
                                    styles.partArrow,
                                    isExpanded && styles.partArrowActive,
                                ]}
                            >
                                {isExpanded ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>

                        {/* Nội dung phần (câu hỏi) */}
                        {isExpanded && (
                            <View style={styles.partContent}>
                                <FlatList<Question>
                                    data={part.questions}
                                    keyExtractor={(item, idx) =>
                                        `${partIdx}-${item._id || idx}`
                                    }
                                    renderItem={({ item, index }) => (
                                        <View style={styles.questionWrapper}>
                                            {/* Tiêu đề câu hỏi */}
                                            <Text style={styles.questionTitle}>
                                                {`Câu ${index + 1}: ${item.description}`}
                                            </Text>

                                            {/* Các đáp án */}
                                            {item.answers?.map(
                                                (ans: Answer, ansIdx: number) => (
                                                    <View
                                                        key={ans._id}
                                                        style={styles.optionRow}
                                                    >
                                                        <Text style={styles.optionLabel}>
                                                            {String.fromCharCode(
                                                                65 + ansIdx
                                                            )}
                                                            .
                                                        </Text>
                                                        <Text style={styles.optionText}>
                                                            {ans.description}
                                                        </Text>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    )}
                                />
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
});

export default PreviewExam;