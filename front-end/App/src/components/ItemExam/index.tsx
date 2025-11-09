import { useNavigation } from "@react-navigation/native";
import { Exam } from "../../types/typeObj";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";
import ButtonCustom from "../ButtonCustom";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";

interface Props {
    exam?: Exam;
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const ItemExam = (props: Props) => {
    const { exam } = props;
    const navigation = useNavigation<NavigationProps>();
    const handleButtonPress = () => {
        console.log("loanhtm exam: ", exam);
        navigation.navigate('PracticeExamDetailScreen', { exam: exam });
    };

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => handleButtonPress()}
            >
                <Image source={{ uri: exam?.image }} style={styles.image} />
                <View style={styles.content}>
                    {/* Header: title + subject */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{exam?.name}</Text>
                        {/* <View style={styles.subjectTag}>
                            <Text style={styles.subjectText}>{subject}</Text>
                        </View> */}
                    </View>

                    {/* Number questions + Duration */}
                    <View style={styles.iconInfo}>
                        <View style={styles.iconGroup}>
                            <Image source={require("../../assets/icons/group.png")} style={styles.icon} />
                            <Text style={styles.iconText}>{exam?.number + " câu"}</Text>
                        </View>
                        <View style={styles.iconGroup}>
                            <Image source={require("../../assets/icons/like.png")} style={styles.icon} />
                            <Text style={styles.iconText}>{exam?.duration + " phút"}</Text>
                        </View>
                    </View>
                    <ButtonCustom
                        type="secondary"
                        name="Chi Tiết"
                        paddingVertical={5}
                    />
                    {/* Footer: buttons */}
                    {/* <View style={styles.footerRow}>
                        <View style={styles.iconRow}>
                            <View style={styles.iconGroupLink}>
                                <Image source={require("../../assets/icons/like.png")} style={styles.iconLink} />
                                <Text style={styles.linkText}>Thích</Text>
                            </View>
                            <View style={styles.iconGroupLink}>
                                <Image source={require("../../assets/icons/share.png")} style={styles.iconLink} />
                                <Text style={styles.linkText}>Chia sẻ</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onPressButton}
                            style={[
                                styles.button,
                                { backgroundColor: done ? "#6B57BE" : "#22A112" },
                            ]}
                        >
                            <Text style={styles.buttonText}>{done ? "Xem kết quả" : "Vào thi"}</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </TouchableOpacity>
        </>
    );
}

export default ItemExam;