import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./index.styles";

interface ExpandDesSubjectProps {
    text: string;
    numberOfLines?: number;
}

const ExpandDesSubject: React.FC<ExpandDesSubjectProps> = ({
    text,
    numberOfLines = 3,
}) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <View>
            <Text
                style={styles.text}
                numberOfLines={expanded ? undefined : numberOfLines}
            >
                {text}
            </Text>

            <TouchableOpacity onPress={toggleExpanded}>
                <Text style={styles.toggle}>
                    {expanded ? "Rút gọn" : "Xem thêm"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ExpandDesSubject;
