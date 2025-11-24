import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    instructionBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0C4299",
        marginBottom: 20,
        letterSpacing: 0.3
    },
    instructionRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#B9D2FA",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        marginTop: 2,
    },
    circleText: {
        color: "#B9D2FA",
        fontSize: 13,
        fontWeight: "600",
    },
    instructionText: {
        flex: 1,
        color: "#5D697E",
        fontSize: 13,
        lineHeight: 18,
    },
});