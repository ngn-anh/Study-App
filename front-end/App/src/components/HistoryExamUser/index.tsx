import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { styles } from "./index.styles";
import { ExamHistory } from "../../types/typeObj";
import { CalendarDotsIcon, ClockIcon } from "phosphor-react-native";
import { getAllExamResultDetail } from "../../api/examResult";
import { formatDateTime, secondsToHHMMSS } from "../../utils/time";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { useNavigation } from "@react-navigation/native";
import { Icons } from "../../constants/icons";

interface Props {
    examId?: string | null;
    userId?: string;
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const HistoryExamUser: React.FC<Props> = memo(({ examId, userId }) => {
    const navigation = useNavigation<NavigationProps>();

    const [history, setHistory] = useState<ExamHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const fetchHistory = async () => {
        if (!examId || !userId) {
            setLoading(false);
            return;
        }
        try {
            const res = await getAllExamResultDetail(userId, examId);

            const data: ExamHistory[] = Array.isArray(res) ? res : [];
            setHistory(data);
        } catch (e) {
            console.warn("Fetch exam history failed:", e);
            setError("Không tải được dữ liệu, đang hiển thị mẫu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [examId, userId]);

    const calculateScore = (e: ExamHistory) => {
        const raw = (e.total_correct / e.total_question) * 10;
        return Math.round(raw * 100) / 100;
    };

    const getScoreStyle = (score: number) => {
        if (score < 3.5) {
            return {
                level: "Kém",
                color: "#FFFFFF",
                backgroundColor: "#DC2626",
                borderColor: "#B91C1C",
            };
        }
        if (score < 5.0) {
            return {
                level: "Yếu",
                color: "#FFFFFF",
                backgroundColor: "#EF4444",
                borderColor: "#DC2626",
            };
        }
        if (score < 6.5) {
            return {
                level: "Trung bình",
                color: "#FFFFFF",
                backgroundColor: "#ffb700ff",
                borderColor: "#F59E0B",
            };
        }
        if (score < 8.0) {
            return {
                level: "Khá",
                color: "#000000",
                backgroundColor: "#34D399",
                borderColor: "#10B981",
            };
        }
        if (score < 9.0) {
            return {
                level: "Giỏi",
                color: "#FFFFFF",
                backgroundColor: "#3B82F6",
                borderColor: "#2563EB",
            };
        }
        // score >= 9.0
        return {
            level: "Xuất sắc",
            color: "#FFFFFF",
            backgroundColor: "#8B5CF6",
            borderColor: "#7C3AED",
        };
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0C4299" />
            </View>
        );
    }

    if (!history || history.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    Bạn chưa từng làm đề thi này. {"\n"}
                    Bắt đầu làm bài ngay bạn nhé! 😊
                </Text>
            </View>
        );
    }

    const StatItem: React.FC<{
        label: string;
        value: number;
        color: string;
        icon: any;
    }> = ({ label, value, color, icon }) => (
        <View style={styles.statItem}>
            <View style={styles.statLeft}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={[styles.statValue, { color: color }]}>{value}</Text>
            </View>
            <Image source={icon} style={styles.statIcon} resizeMode="contain" />
        </View>
    );

    const handleDetailResultExam = (examResultId: string) => {
        console.log("loanhtm ExamDetailResultScreen: ", examResultId);
        navigation.navigate('ExamDetailResultScreen', { examResultId: examResultId });
    }

    return (
        <ScrollView style={styles.container}>

            {/* Render từng ExamHistory trong mảng */}
            {history.map((item, index) => {
                const score = calculateScore(item);
                const scoreStyle = getScoreStyle(score);
                const answered = item.total_correct + item.total_wrong;

                return (
                    <TouchableOpacity
                        key={item.exam_result_id}
                        // style={styles.historyItem}
                        style={[
                            styles.historyItem,
                            {
                                borderColor: scoreStyle.borderColor,
                                borderWidth: 2,
                                borderRadius: 12,
                                backgroundColor: "#FFFFFF",
                                overflow: "hidden",
                                marginBottom: 16,
                            }
                        ]}
                        onPress={() => handleDetailResultExam(item.exam_result_id)}
                    >
                        <View
                            style={[
                                styles.levelHeader,
                                {
                                    backgroundColor: scoreStyle.backgroundColor,
                                    borderBottomWidth: 3,
                                    borderBottomColor: scoreStyle.backgroundColor,
                                },
                            ]}
                        >
                            <View style={styles.levelRow}>
                                <Text style={[styles.levelText, { color: scoreStyle.color }]}>
                                    {scoreStyle.level}
                                </Text>
                            </View>
                        </View>

                        {/* Nội dung chính */}
                        <View style={styles.historyContent}>
                            <View style={styles.row}>
                                <View
                                    style={[
                                        styles.scoreBox,
                                        { backgroundColor: scoreStyle.backgroundColor },
                                    ]}
                                >
                                    <Text style={[styles.scoreText, { color: scoreStyle.color }]}>
                                        Điểm
                                    </Text>
                                    <Text style={[styles.scoreText, { color: scoreStyle.color }]}>
                                        {score.toFixed(2)} / 10
                                    </Text>
                                </View>

                                <View style={styles.detailContainer}>
                                    <View style={styles.detailItem}>
                                        <ClockIcon color="#000" size={20} />
                                        <Text style={styles.timeLine}>
                                            {secondsToHHMMSS(item.durationSec || 0, true)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <CalendarDotsIcon color="#000" size={20} />
                                        <Text style={styles.timeLine}>
                                            {formatDateTime(item.time_end || "0")}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Progress bar */}
                            <View style={styles.progressWrapper}>
                                <View
                                    style={[
                                        styles.progressBackground,
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.progressDone,
                                            {
                                                flex: answered / item.total_question,
                                            },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.progressRemain,
                                            {
                                                flex: item.total_not_done / item.total_question,
                                            },
                                        ]}
                                    />
                                </View>
                                <View style={styles.progressLabelOverlay}>
                                    <Text style={styles.progressLabel}>
                                        {"Số câu đã làm: "}
                                        {answered}/{item.total_question}
                                    </Text>
                                </View>
                            </View>

                            {/* Phần thống kê: Đúng / Sai / Bỏ trống */}
                            <View style={styles.statsRow}>
                                <StatItem
                                    label="Đúng"
                                    value={item.total_correct}
                                    color={"#22A112"}
                                    icon={Icons.SuccessIcon}
                                />
                                <StatItem
                                    label="Sai"
                                    value={item.total_wrong}
                                    color={"#FF0000"}
                                    icon={Icons.ErrorIcon}
                                />
                                <StatItem
                                    label="Bỏ trống"
                                    value={item.total_not_done}
                                    color={"#FFB700"}
                                    icon={Icons.WarningIcon}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}

            {/* Thông báo lỗi (nếu có) – nằm dưới cùng */}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView >
    );
});

export default HistoryExamUser;