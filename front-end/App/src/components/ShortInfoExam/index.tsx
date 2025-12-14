import { ClockIcon, ThumbsUpIcon, UsersIcon } from "phosphor-react-native";
import { Image, Text, View } from "react-native";
import { Exam } from "../../types/typeObj";
import { styles } from "./index.styles";
import { Images } from "../../constants/images";

interface Props {
    exam: Exam | any;
}

const ShortInfoExam = (props: Props) => {
    const { exam } = props;

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