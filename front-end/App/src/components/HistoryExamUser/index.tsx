/* --------------------------------------------------------------
   HistoryExamUser – hiển thị lịch sử thi của một người dùng.
   -------------------------------------------------------------- */
import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { styles } from "./index.styles";
import { Exam } from "../../types/typeObj";
// import { Exam } from "../../types/typeObj";
// import { styles as externalStyles } from "./index.styles";

interface ExamHistory {
    time: string;
    /** Thời gian hoàn thành (ví dụ "15:30 17-04-2025") */
    timeCompleted: string;
    /** Số câu đúng */
    answerCorrect: number;
    /** Số câu sai */
    answerWrong: number;
    /** Tổng số câu trong đề */
    totalQuestion: number;
}

/* ---------------------  Props của component --------------------- */
interface Props {
    /** Đề thi – chỉ dùng để lấy exam.id */
    exam?: Exam;
    /** Id của người dùng muốn lấy lịch sử */
    userId?: string;
}

/* ------------------------  Component --------------------------- */
const HistoryExamUser: React.FC<Props> = memo(({ exam, userId }) => {
    const [history, setHistory] = useState<ExamHistory | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /* -------------------------------------------------
          Mock data – dùng khi không có API thật
          ------------------------------------------------- */
    const mockData: ExamHistory = {
        time: "00:30:15",
        timeCompleted: "15:30 17-04-2025",
        answerCorrect: 25,
        answerWrong: 5,
        totalQuestion: 34,
    };

    /* ----------------------  Fetch API  --------------------- */
    useEffect(() => {
        // Nếu không có exam.id hoặc userId → dùng mock ngay
        if (!exam?.id || !userId) {
            setHistory(mockData);
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                // -------------------------------------------------
                // 👉 Thay URL này bằng endpoint thực tế của bạn
                // -------------------------------------------------
                const resp = await fetch(
                    `https://your-api.com/users/${userId}/exams/${exam.id}/history`
                );
                const json = await resp.json();

                // Giả sử API trả về đúng định dạng ExamHistory
                const data: ExamHistory = json?.history ?? mockData;
                setHistory(data);
            } catch (e) {
                console.warn("Fetch exam history failed:", e);
                // Khi lỗi → fallback sang mock
                setHistory(mockData);
                setError("Không tải được dữ liệu, đang hiển thị mẫu.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [exam?.id, userId]);

    /* ----------------------  Helper  ------------------------ */
    const calculateScore = (h: ExamHistory) => {
        const raw = (h.answerCorrect / h.totalQuestion) * 10;
        // làm tròn 2 chữ số
        return Math.round(raw * 100) / 100;
    };

    const getScoreStyle = (score: number) => {
        if (score < 5) {
            return { backgroundColor: "#FF0000", color: "#FFFFFF" };
        }
        if (score >= 5 && score < 7) {
            return { backgroundColor: "#FFB700", color: "#000000" };
        }
        // >=7
        return { backgroundColor: "#22A012", color: "#FFFFFF" };
    };

    /* -------------------------- Render ---------------------- */
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0C4299" />
            </View>
        );
    }

    if (!history) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Không có dữ liệu lịch sử.</Text>
            </View>
        );
    }

    const score = calculateScore(history);
    const scoreStyle = getScoreStyle(score);
    const answered = history.answerCorrect + history.answerWrong;
    const blank = history.totalQuestion - answered;

    const StatItem: React.FC<{ label: string; value: number }> = ({
        label,
        value,
    }) => (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}:</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* -------------------------------------------------
              ROW: Score box (trái) + Thông tin chi tiết (phải)
              ------------------------------------------------- */}
            <View style={styles.row}>
                {/* ---- Score box ---- */}
                <View
                    style={[
                        styles.scoreBox,
                        { backgroundColor: scoreStyle.backgroundColor },
                    ]}
                >
                    <Text style={[styles.scoreText, { color: scoreStyle.color }]}>
                        {score.toFixed(2)} / 10
                    </Text>
                </View>

                {/* ---- Thông tin chi tiết ---- */}
                <View style={styles.detailContainer}>
                    {/* Thời gian thi */}
                    <Text style={styles.timeLine}>Thời gian thi: {history.time}</Text>
                    {/* Thời gian hoàn thành */}
                    <Text style={styles.timeLine}>
                        Thời gian hoàn thành: {history.timeCompleted}
                    </Text>
                </View>
            </View>
            {/* Progress bar */}
            <View style={styles.progressWrapper}>
                <View style={styles.progressBackground}>
                    {/* phần đã làm */}
                    <View
                        style={[
                            styles.progressDone,
                            { flex: answered / history.totalQuestion },
                        ]}
                    />
                    {/* phần chưa làm */}
                    <View
                        style={[
                            styles.progressRemain,
                            {
                                flex:
                                    (history.totalQuestion - answered) / history.totalQuestion,
                            },
                        ]}
                    />
                </View>
                {/* Text nằm chính giữa thanh */}
                <View style={styles.progressLabelOverlay}>
                    <Text style={styles.progressLabel}>
                        {answered}/{history.totalQuestion}
                    </Text>
                </View>
            </View>

            {/* Phần thống kê: Đúng / Sai / Bỏ trống */}
            <View style={styles.statsRow}>
                <StatItem label="Đúng" value={history.answerCorrect} />
                <StatItem label="Sai" value={history.answerWrong} />
                <StatItem label="Bỏ trống" value={blank} />
            </View>
            {/* Thông báo lỗi (nếu có) – nằm dưới cùng */}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
});

export default HistoryExamUser;
