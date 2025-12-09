import { useNavigation } from "@react-navigation/native";
import { Exam } from "../../types/typeObj";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";
import ButtonCustom from "../ButtonCustom";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { ClockIcon, QuestionIcon } from "phosphor-react-native";
import { IMAGE_DEFAULT } from "../../constants/images";

interface Props {
    exam?: Exam;
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const ItemExam = (props: Props) => {
    const { exam } = props;
    const navigation = useNavigation<NavigationProps>();

    const imageExam = exam?.image || IMAGE_DEFAULT.EXAM;

    const handleButtonPress = () => {
        console.log("loanhtm exam: ", exam);
        navigation.navigate('PracticeExamDetailScreen', { examId: exam?._id });
    };

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => handleButtonPress()}
            >
                <Image source={{ uri: imageExam }} style={styles.image} />
                <View style={styles.content}>
                    {/* Header: title + subject */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{exam?.name}</Text>
                    </View>

                    <View style={styles.iconInfo}>
                        <View style={styles.iconGroup}>
                            <QuestionIcon style={styles.icon} />
                            <Text style={styles.iconText}>{exam?.numberQuestion + " câu"}</Text>
                        </View>
                        <View style={styles.iconGroup}>
                            <ClockIcon style={styles.icon} />
                            <Text style={styles.iconText}>{exam?.duration + " phút"}</Text>
                        </View>
                    </View>
                    <ButtonCustom
                        type="secondary"
                        name="Chi Tiết"
                        paddingVertical={5}
                    />
                </View>
            </TouchableOpacity>
        </>
    );
}

export default ItemExam;