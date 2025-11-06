import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";

interface Props {
    type: "primary" | "secondary" | "disable";
    name: string;
    image?: string;
    paddingVertical?: number;
    paddingHorizontal?: number;
    width?: number;
    onPress?: () => void;
}

const ButtonCustom = (props: Props) => {
    const { type, name, image, paddingVertical, paddingHorizontal, width, onPress } = props;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                type === "primary" ? styles.containerPrimary : null,
                type === "secondary" ? styles.containerSecondary : null,
                type === "disable" ? styles.containerDisable : null,
                paddingVertical ? { paddingVertical: paddingVertical } : {},
                paddingHorizontal ? { paddingHorizontal: paddingHorizontal } : {},
                width ? { width: width } : {},
            ]}
        >
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
}

export default ButtonCustom;