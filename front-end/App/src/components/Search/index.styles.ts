import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        elevation: 2, // Đổ bóng nếu cần
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    searchButton: {
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    filterButton: {
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});