import { useNavigation } from "@react-navigation/native";
import { Exam } from "../../types/typeObj";
import { Image, Text, View } from "react-native";
import { styles } from "./index.styles";
import ButtonCustom from "../ButtonCustom";

interface Props {
    exam?: Exam;
}

const ItemExam = (props: Props) => {
    const { exam } = props;
    const navigation = useNavigation();
    const handleButtonPress = () => {
        console.log("Button was pressed!");
        // Thêm logic khác ở đây
    };

    return (
        <>
            <View style={styles.container}>
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
                        type="primary"
                        name="Chi Tiết"
                        paddingVertical={10}
                        onPress={handleButtonPress}
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
            </View>
        </>
    );
}

export default ItemExam;