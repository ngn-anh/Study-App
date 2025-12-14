import { ClockIcon, ThumbsUpIcon, UsersIcon } from "phosphor-react-native";
import { Image, Text, View } from "react-native";
import { Exam } from "../../types/typeObj";
import { styles } from "./index.styles";
// import { useEffect, useState } from "react";
// import { getExamInfo } from "../../api/exam";
import { Images } from "../../constants/images";

interface Props {
    exam: Exam | any;
}

const ShortInfoExam = (props: Props) => {
    const { exam } = props;

    // const [examInfo, setExamInfo] = useState<{
    //     name: string;
    //     image?: string;
    //     participants?: number;
    //     duration: number;
    //     likes?: number;
    // } | null>(null);

    // const getMockExamInfo = () => ({
    //     name: exam?.name || "Đề thi không có tên",
    //     image: exam?.image || "https://res.cloudinary.com/your-image/exam-placeholder.jpg",
    //     participants: Math.floor(Math.random() * 500) + 50,
    //     duration: exam?.duration ? Number(exam.duration) : 90, // Mặc định 90 phút
    //     likes: Math.floor(Math.random() * 200) + 50, // Random 50-250 likes
    // });

    // const fetchExamInfo = async () => {
    //     try {
    //         const data = await getExamInfo(exam.id);
    //         setExamInfo({
    //             name: data?.name,
    //             image: data?.image,
    //             participants: data?.participants,
    //             duration: data?.duration, // thay status bằng duration
    //             likes: 120, // tạm fix cứng
    //         });
    //     } catch (err) {
    //         console.error("Không lấy được thông tin bài thi:", err);
    //         setExamInfo(getMockExamInfo());
    //     }
    // };

    // useEffect(() => {
    //     fetchExamInfo();
    // }, [exam?.id]);

    if (!exam) {
        return (
            <View style={styles.container}>
                <Text>Đang tải thông tin bài thi...</Text>
            </View>
        );
    }

    return (
        <>
            {/* Hình ảnh */}
            <Image
                source={{ uri: exam?.image }}
                style={styles.image}
                defaultSource={Images.ExamDefault}
            />

            {/* Row trạng thái */}
            <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                    <ClockIcon size={16} color="#000000" weight="bold" />
                    <Text style={styles.statusText}>{exam?.duration} phút</Text>
                </View>
                <View style={styles.statusItem}>
                    <UsersIcon size={16} color="#000000" weight="bold" />
                    <Text style={styles.statusText}>{exam?.participants}</Text>
                </View>
                <View style={styles.statusItem}>
                    <ThumbsUpIcon size={16} color="#000000" weight="bold" />
                    <Text style={styles.statusText}>{exam?.total_like}</Text>
                </View>
            </View>
        </>
    );
}

export default ShortInfoExam;