import { Image, Text, TouchableOpacity } from "react-native";
import { styles } from "./index.styles";

interface Props {
    type: "primary" | "secondary" | "disable";
    name: string;
    image?: any;
    styleImage?: object;
    paddingVertical?: number;
    paddingHorizontal?: number;
    width?: number;
    onPress?: () => void;
}

const ButtonCustom = (props: Props) => {
    const { type, name, image, styleImage, paddingVertical, paddingHorizontal, width, onPress } = props;

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
            {image && <Image source={image} style={styleImage} />}
            <Text style={[
                styles.name,
                type === "primary" ? styles.namePrimary : null,
                type === "secondary" ? styles.nameSecondary : null,
                type === "disable" ? styles.nameDisable : null,
            ]}>{name}</Text>
        </TouchableOpacity>
    );
}

export default ButtonCustom;