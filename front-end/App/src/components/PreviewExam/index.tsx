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
import { Exam } from "../../types/typeObj";

/* -------------------  Types nhận từ API -------------------- */
export interface Question {
    /** Câu hỏi (vd: “Câu 1: Đề bài …”) */
    title: string;
    /** Các đáp án A‑D */
    options: string[];
}
export interface Part {
    /** Tên phần – “Phần 1”, “Phần 2”, … */
    title: string;
    /** Danh sách câu hỏi của phần */
    questions: Question[];
}

/* -------------------  Props của component ----------------- */
interface Props {
    /** Đề thi sẽ preview (chỉ dùng để lấy id khi gọi API) */
    exam?: Exam;
}

/* -----------------------  Component ------------------------ */
const PreviewExam: React.FC<Props> = memo(({ exam }) => {
    /* ---------- State ----------
     * parts          : dữ liệu lấy từ server (hoặc mock)
     * loading        : hiển thị ActivityIndicator khi chờ
     * expandedParts  : Set chứa index của các phần đang mở
     */
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());

    /* ---------------------------------------------------------
       Mock data – sẽ được dùng khi:
          • Ứng dụng đang ở chế độ development (__DEV__) hoặc
          •  API trả về lỗi.
       --------------------------------------------------------- */
    const mockData: Part[] = [
        {
            title: "Phần 1",
            questions: [
                {
                    title: "Câu 1: Đề bài 1",
                    options: [
                        "Đáp án A",
                        "Đáp án B",
                        "Đáp án C",
                        "Đáp án D",
                    ],
                },
                {
                    title: "Câu 2: Đề bài 2",
                    options: [
                        "Đáp án A",
                        "Đáp án B",
                        "Đáp án C",
                        "Đáp án D",
                    ],
                },
            ],
        },
        {
            title: "Phần 2",
            questions: [
                {
                    title: "Câu 1: Đề bài 1",
                    options: ["1", "2", "3", "4"],
                },
                {
                    title: "Câu 2: Đề bài 2",
                    options: ["1", "2", "3", "4"],
                },
            ],
        },
        {
            title: "Phần 3",
            questions: [
                {
                    title: "Câu 1: Đề bài 1",
                    options: ["A", "B", "C", "D"],
                },
                {
                    title: "Câu 2: Đề bài 2",
                    options: ["A", "B", "C", "D"],
                },
            ],
        },
    ];

    /* --------------------  Lấy dữ liệu -------------------- */
    useEffect(() => {
        // Nếu không có exam.id → không fetch, dùng mock ngay
        if (!exam?.id) {
            setParts(mockData);
            setExpandedParts(new Set([0])); // mở phần 1 mặc định
            setLoading(false);
            return;
        }

        const fetchParts = async () => {
            try {
                const response = await fetch(
                    `https://your‑api.com/exams/${exam.id}/parts`
                );
                const json = await response.json();

                // Giả sử API trả về { parts: Part[] }
                const fetchedParts: Part[] = json?.parts ?? [];

                // Nếu API trả về rỗng → dùng mock để tránh màn trắng
                if (fetchedParts.length === 0) {
                    setParts(mockData);
                    setExpandedParts(new Set([0]));
                } else {
                    setParts(fetchedParts);
                    // mở mặc định phần đầu tiên nếu có
                    setExpandedParts(new Set([0]));
                }
            } catch (error) {
                console.warn("Failed to fetch exam parts:", error);
                // Khi có lỗi → fallback sang mock data
                setParts(mockData);
                setExpandedParts(new Set([0]));
            } finally {
                setLoading(false);
            }
        };

        fetchParts();
    }, [exam?.id]);

    /* --------------------  Mở / Đóng phần ----------------- */
    const togglePart = (index: number) => {
        setExpandedParts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index); // đóng
            } else {
                newSet.add(index); // mở (không ảnh hưởng tới các phần khác)
            }
            return newSet;
        });
    };

    /* --------------------  Render -------------------------- */
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={styles.accentColor.color} />
            </View>
        );
    }

    if (parts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có dữ liệu để hiển thị</Text>
            </View>
        );
    }

    return (
        <View style={styles.previewExamContainer}>
            {/* ----------- Danh sách các phần (Section) ----------- */}
            {parts.map((part, partIdx) => {
                const isExpanded = expandedParts.has(partIdx);
                return (
                    <View key={partIdx} style={styles.partWrapper}>
                        {/* ---- Tiêu đề phần ---- */}
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

                        {/* ---- Nội dung phần (câu hỏi) ---- */}
                        {
                            isExpanded && (
                                <View style={styles.partContent}>
                                    {/* -------------------------------------------------
                        FlatList được generic <Question> → item luôn có kiểu
                        Question, index luôn là number.
                        ------------------------------------------------- */}
                                    <FlatList<Question>
                                        data={part.questions}
                                        keyExtractor={(_, i) => `${partIdx}-${i}`} // key duy nhất
                                        renderItem={({
                                            item,
                                            index,
                                        }: {
                                            item: Question;
                                            // item: any;
                                            index: number;
                                        }) => (
                                            <View style={styles.questionWrapper}>
                                                {/* Tiêu đề câu hỏi */}
                                                <Text style={styles.questionTitle}>{item.title}</Text>

                                                {/* Các đáp án A‑D */}
                                                {item.options.map(
                                                    (opt: string, optIdx: number) => (
                                                        <View
                                                            key={optIdx}
                                                            style={styles.optionRow}
                                                        >
                                                            <Text style={styles.optionLabel}>
                                                                {String.fromCharCode(65 + optIdx)}.
                                                            </Text>
                                                            <Text style={styles.optionText}>{opt}</Text>
                                                        </View>
                                                    )
                                                )}
                                            </View>
                                        )}
                                    />
                                </View>
                            )
                        }
                    </View>
                );
            })}
        </View >
    );
});

export default PreviewExam;