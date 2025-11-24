import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingTop: 18,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
    },
    statusRow: {
        flexDirection: "row",
        gap: 18,
        alignItems: "center",
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    statusText: {
        fontSize: 13,
        color: "#000000",
    },
});