export const a='1';
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        gap: 28,
    },

    /* ----- Score box (trái) ----- */
    scoreBox: {
        minWidth: 80,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        fontSize: 14,
        fontWeight: "600",
    },

    /* ----- Detail container (phải) ----- */
    detailContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent:'space-between',
        paddingHorizontal: 3,
        borderWidth: 1,
    },

    detailItem:{
        // flex: 1,
         flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    timeLine: {
        color: "#000",
    },

    /* ----- Progress bar ----- */
    progressWrapper: {
        marginTop: 4,
        marginBottom: 4,
        position: "relative",
        height: 20,
        borderRadius: 10,
        overflow: "hidden",
    },
    progressBackground: {
        flexDirection: "row",
        height: "100%",
        backgroundColor: "#89B5FB",
    },
    progressDone: {
        backgroundColor: "#0C4299",
    },
    progressRemain: {
        backgroundColor: "#89B5FB",
    },
    progressLabelOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FFF",
    },

    /* ----- Stats (Đúng / Sai / Bỏ trống) ----- */
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        marginRight: 2,
    },
    statValue: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },

    errorText: {
        color: "#FF4444",
        marginTop: 8,
        fontSize: 13,
        textAlign: "center",
    },
});
