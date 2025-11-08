import { StyleSheet } from "react-native";
import { fontScale, scale, verticalScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(12),
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        position: 'relative',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    headerTitle: {
        fontSize: fontScale(18),
        fontWeight: '600',
        color: '#083070',
    },
});