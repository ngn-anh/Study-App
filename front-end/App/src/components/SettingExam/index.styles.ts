import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        // padding: 0,
        backgroundColor: "#FFF",
        marginTop: 8,
    },

    /* --- Section titles --- */
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },

    /* --- Mode selector --- */
    modeGroup: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap:20,
        marginBottom: 20,
    },
    modeItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#5856D6",
        backgroundColor: "#FFF",
        // marginHorizontal: 4,
    },
    modeItemActive: {
        backgroundColor: "#5856D6",
        borderColor: "#5856D6",
    },
    modeText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#000000",
    },
    modeTextActive: {
        color: "#FFF",
    },

    /* --- Settings (checkboxes) --- */
    settingGroup: {
        // vertical stack
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    settingText: {
        marginLeft: 12,
        fontSize: 15,
        color: "#333",
    },
});
