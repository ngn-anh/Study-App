// /* --------------------------------------------------------------
//    HistoryExamUser – hiển thị lịch sử thi của một người dùng.
//    -------------------------------------------------------------- */
// import React, { memo, useEffect, useState } from "react";
// import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
// import { styles } from "./index.styles";
// import { ExamHistory } from "../../types/typeObj";
// import { CalendarDotsIcon, ClockIcon } from "phosphor-react-native";
// import { getAllExamResultDetail } from "../../api/examResult";
// import { formatDateTime, secondsToHHMMSS } from "../../utils/time";

// /* ---------------------  Props của component --------------------- */
// interface Props {
//     examId?: string | null;
//     userId?: string;
// }

// /* ------------------------  Component --------------------------- */
// const HistoryExamUser: React.FC<Props> = memo(({ examId, userId }) => {
//     const [history, setHistory] = useState<ExamHistory | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     /* -------------------------------------------------
//           Mock data – dùng khi không có API thật
//           ------------------------------------------------- */
//     const mockData: ExamHistory = {
//         "exam_result_id": "690f10f71b908e644b126284",
//         "exam_id": "6908a903bc2ae0fd775ccad6",
//         "user_id": "690426dbdbf4313e26d816d5",
//         "total_question": 10,
//         "total_correct": 1,
//         "total_wrong": 2,
//         "total_not_done": 7,
//         "is_finish": true,
//         "time_start": "2025-11-08T09:44:13.888Z",
//         "time_end": "2025-11-08T09:44:21.906Z",
//         "durationSec": 8,
//         "duration_text": "0p08s"
//     };

//     const fetchHistory = async () => {
//         if (!examId || !userId) {
//             setHistory(mockData);
//             setLoading(false);
//             return;
//         }
//         try {
//             const res = await getAllExamResultDetail(userId, examId);

//             // Giả sử API trả về đúng định dạng ExamHistory
//             const data: ExamHistory = res ?? mockData;
//             setHistory(data);
//         } catch (e) {
//             console.warn("Fetch exam history failed:", e);
//             // Khi lỗi → fallback sang mock
//             setHistory(mockData);
//             setError("Không tải được dữ liệu, đang hiển thị mẫu.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchHistory();
//     }, [examId, userId]);

//     const calculateScore = (e: ExamHistory) => {
//         const raw = (e.total_correct / e.total_question) * 10;
//         return Math.round(raw * 100) / 100;
//     };

//     const getScoreStyle = (score: number) => {
//         if (score < 5) {
//             return { backgroundColor: "#FF0000", color: "#FFFFFF" };
//         }
//         if (score >= 5 && score < 7) {
//             return { backgroundColor: "#FFB700", color: "#000000" };
//         }
//         return { backgroundColor: "#22A012", color: "#FFFFFF" };
//     };

//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#0C4299" />
//             </View>
//         );
//     }

//     if (!history) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>Bạn chưa từng làm đề thi này. Bắt đầu làm bài ngay bạn nhé!</Text>
//             </View>
//         );
//     }

//     const score = calculateScore(history);
//     const scoreStyle = getScoreStyle(score);
//     const answered = history.total_correct + history.total_wrong;

//     const StatItem: React.FC<{ label: string; value: number }> = ({
//         label,
//         value,
//     }) => (
//         <View style={styles.statItem}>
//             <Text style={styles.statLabel}>{label}:</Text>
//             <Text style={styles.statValue}>{value}</Text>
//         </View>
//     );

//     return (
//         <TouchableOpacity style={styles.container}>
//             {/* -------------------------------------------------
//               ROW: Score box (trái) + Thông tin chi tiết (phải)
//               ------------------------------------------------- */}
//             <View style={styles.row}>
//                 {/* ---- Score box ---- */}
//                 <View
//                     style={[
//                         styles.scoreBox,
//                         { backgroundColor: scoreStyle.backgroundColor },
//                     ]}
//                 >
//                     <Text style={[styles.scoreText, { color: scoreStyle.color }]}>
//                         Điểm
//                     </Text>
//                     <Text style={[styles.scoreText, { color: scoreStyle.color }]}>
//                         {score.toFixed(2)} / 10
//                     </Text>
//                 </View>

//                 {/* ---- Thông tin chi tiết ---- */}
//                 <View style={styles.detailContainer}>
//                     <View style={styles.detailItem}>
//                         <ClockIcon color="#000" size={20} />
//                         <Text style={styles.timeLine}>{secondsToHHMMSS(history?.durationSec || 0, true)}</Text>
//                     </View>
//                     <View style={styles.detailItem}>
//                         <CalendarDotsIcon color="#000" size={20} />
//                         <Text style={styles.timeLine}>
//                             {formatDateTime(history?.time_end || '0')}
//                         </Text>
//                     </View>
//                 </View>
//             </View>
//             {/* Progress bar */}
//             <View style={styles.progressWrapper}>
//                 <View style={styles.progressBackground}>
//                     <View
//                         style={[
//                             styles.progressDone,
//                             { flex: answered / history.total_question },
//                         ]}
//                     />
//                     <View
//                         style={[
//                             styles.progressRemain,
//                             {
//                                 flex: history.total_not_done / history.total_question,
//                             },
//                         ]}
//                     />
//                 </View>
//                 <View style={styles.progressLabelOverlay}>
//                     <Text style={styles.progressLabel}>
//                         {"Số câu đã làm: "}{answered}/{history.total_question}
//                     </Text>
//                 </View>
//             </View>

//             {/* Phần thống kê: Đúng / Sai / Bỏ trống */}
//             <View style={styles.statsRow}>
//                 <StatItem label="Đúng" value={history.total_correct} />
//                 <StatItem label="Sai" value={history.total_wrong} />
//                 <StatItem label="Bỏ trống" value={history.total_not_done} />
//             </View>
//             {/* Thông báo lỗi (nếu có) – nằm dưới cùng */}
//             {error && <Text style={styles.errorText}>{error}</Text>}
//         </TouchableOpacity>
//     );
// });

// export default HistoryExamUser;

import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "./index.styles";
import { ExamHistory } from "../../types/typeObj";
import { CalendarDotsIcon, ClockIcon } from "phosphor-react-native";
import { getAllExamResultDetail } from "../../api/examResult";
import { formatDateTime, secondsToHHMMSS } from "../../utils/time";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { useNavigation } from "@react-navigation/native";

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

    /* -------------------------------------------------
          Mock data – dùng khi không có API thật
          ------------------------------------------------- */
    const mockData: ExamHistory[] = [
        {
            "exam_result_id": "690f10f71b908e644b126284",
            "exam_id": "6908a903bc2ae0fd775ccad6",
            "user_id": "690426dbdbf4313e26d816d5",
            "total_question": 10,
            "total_correct": 1,
            "total_wrong": 2,
            "total_not_done": 7,
            "is_finish": true,
            "time_start": "2025-11-08T09:44:13.888Z",
            "time_end": "2025-11-08T09:44:21.906Z",
            "durationSec": 8,
            "duration_text": "0p08s"
        },
    ];

    const fetchHistory = async () => {
        if (!examId || !userId) {
            setHistory(mockData);
            setLoading(false);
            return;
        }
        try {
            const res = await getAllExamResultDetail(userId, examId);

            // API trả về là mảng ExamHistory[]
            const data: ExamHistory[] = Array.isArray(res) ? res : mockData;
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

    useEffect(() => {
        fetchHistory();
    }, [examId, userId]);

    const calculateScore = (e: ExamHistory) => {
        const raw = (e.total_correct / e.total_question) * 10;
        return Math.round(raw * 100) / 100;
    };

    const getScoreStyle = (score: number) => {
        if (score < 5) {
            return { backgroundColor: "#FF0000", color: "#FFFFFF" };
        }
        if (score >= 5 && score < 7) {
            return { backgroundColor: "#FFB700", color: "#000000" };
        }
        return { backgroundColor: "#22A012", color: "#FFFFFF" };
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
                <Text style={styles.errorText}>Bạn chưa từng làm đề thi này. Bắt đầu làm bài ngay bạn nhé!</Text>
            </View>
        );
    }

    const StatItem: React.FC<{ label: string; value: number }> = ({
        label,
        value,
    }) => (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}:</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );

    const handleDetailResultExam = (examResultId: string) => {
        console.log("laonhtm ExamDetailResultScreen: ", examResultId);
        navigation.navigate('ExamDetailResultScreen', { examResultId: examResultId });
    }

    return (
        <ScrollView style={styles.container}>

            {/* Render từng ExamHistory trong mảng */}
            {history.map((item, index) => {
                const score = calculateScore(item);
                const scoreStyle = getScoreStyle(score);
                const answered = item.total_correct + item.total_wrong;
                const attemptNumber = index + 1;

                return (
                    <TouchableOpacity
                        key={item.exam_result_id}
                        style={styles.historyItem}
                        onPress={() => handleDetailResultExam(item.exam_result_id)}
                    >
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

                            {/* ---- Thông tin chi tiết ---- */}
                            <View style={styles.detailContainer}>
                                <View style={styles.detailItem}>
                                    <ClockIcon color="#000" size={20} />
                                    <Text style={styles.timeLine}>{secondsToHHMMSS(item.durationSec || 0, true)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <CalendarDotsIcon color="#000" size={20} />
                                    <Text style={styles.timeLine}>
                                        {formatDateTime(item.time_end || '0')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* Progress bar */}
                        <View style={styles.progressWrapper}>
                            <View style={styles.progressBackground}>
                                <View
                                    style={[
                                        styles.progressDone,
                                        { flex: answered / item.total_question },
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
                                    {"Số câu đã làm: "}{answered}/{item.total_question}
                                </Text>
                            </View>
                        </View>

                        {/* Phần thống kê: Đúng / Sai / Bỏ trống */}
                        <View style={styles.statsRow}>
                            <StatItem label="Đúng" value={item.total_correct} />
                            <StatItem label="Sai" value={item.total_wrong} />
                            <StatItem label="Bỏ trống" value={item.total_not_done} />
                        </View>
                    </TouchableOpacity>
                );
            })}

            {/* Thông báo lỗi (nếu có) – nằm dưới cùng */}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>
    );
});

export default HistoryExamUser;