import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "phosphor-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";

interface Props {
    data?: any
}

const Header = (props: Props) => {
    const { data } = props;
    const navigation = useNavigation();
    return (
        <>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon size={24} color="#083070" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{data?.name}</Text>
                </View>

                {/* <TouchableOpacity onPress={toggleMenu}>
                    <FadersHorizontalIcon size={24} color="#083070" />
                </TouchableOpacity> */}
            </View>

        </>
    );
}

export default Header;