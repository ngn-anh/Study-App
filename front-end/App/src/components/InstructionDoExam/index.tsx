import { Text, View } from "react-native"
import { styles } from "./index.styles";

const InstructionDoExam = () => {
    return (
        <>
            {/* Instruction box */}
            < View style={styles.instructionBox} >
                <Text style={styles.subTitle}>HƯỚNG DẪN LÀM BÀI</Text>

                {
                    [
                        "Câu hỏi bao gồm 4 loại là chọn 1 đáp án, chọn nhiều đáp án, nhập văn bản trả lời và câu hỏi tham khảo không cần trả lời",
                        "Thời gian làm bài kiểm tra sẽ được đếm lùi dần cho đến khi kết thúc. Bài thi sẽ kết thúc khi hết thời gian hoặc bạn chọn nộp bài",
                        "Hãy bỏ qua câu hỏi khó, bạn vẫn có thể quay lại làm tiếp khi còn thời gian",
                    ].map((text, index) => (
                        <View key={index} style={styles.instructionRow}>
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.instructionText}>{text}</Text>
                        </View>
                    ))
                }
            </View >
        </>
    );
}

export default InstructionDoExam;