import React, { memo, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "./index.styles";
import { Answer, Question } from "../../types/typeObj";
import { getQuestionsByExam } from "../../api/question";

export interface Part {
    /** Tên phần (section) */
    title: string;
    /** Danh sách câu hỏi của phần */
    questions: Question[];
}
interface Props {
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

    const fetchQuestions = async () => {
        if (!examId) {
            setExpandedParts(new Set([0])); // mở phần đầu tiên mặc định
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getQuestionsByExam(examId);

            if (response.success) {
                const questions: Question[] = response?.data?.questions ?? [];
                const { parts: p, sections: s } = processQuestionsData(questions);
                setParts(p);
                setListSection(s);
                setExpandedParts(new Set([0])); // mở phần đầu tiên
            } else {
                console.error("API error:", response?.message);
                setExpandedParts(new Set([0]));
            }
        } catch (error) {
            console.error("Failed to fetch exam questions:", error);
            setExpandedParts(new Set([0]));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [examId]);

    const togglePart = (index: number) => {
        setExpandedParts((prev) => {
            const set = new Set(prev);
            set.has(index) ? set.delete(index) : set.add(index);
            return set;
        });
    };

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