import { StyleSheet } from "react-native";
import { verticalScale, scale } from "../../utils/responsive";

const COLORS = {
    primary: "#0C4299",
    primaryLight: "#E6F0FA",
    textPrimary: "#FFFFFF",
    textSecondary: "#333333",
    bg: "#F9F9F9",
    border: "#E0E0E0",
};

export const styles = StyleSheet.create({
    previewExamContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
        // paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(12),
    },

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: verticalScale(20),
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: verticalScale(20),
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    accentColor: {
        color: COLORS.primary,
    },

    partWrapper: {
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFF",
    },

    partHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(12),
    },
    partHeaderActive: {
        backgroundColor: COLORS.primary,
    },
    partTitle: {
        color: COLORS.textSecondary,
        fontSize: 15,
        fontWeight: "600",
    },
    partArrow: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },

    partTitleActive: {
        color: COLORS.textPrimary,
    },
    partArrowActive: {
        color: COLORS.textPrimary,
    },

    partContent: {
        padding: scale(12),
    },

    questionWrapper: {
        marginBottom: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: verticalScale(8),
    },

    questionTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.textSecondary,
        marginBottom: verticalScale(6),
    },

    optionRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: verticalScale(4),
    },

    optionLabel: {
        width: scale(20), // để các ký tự A., B., … căn lề
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },

    optionText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textSecondary,
    },

});

// import { StyleSheet, Platform } from "react-native";

// const COLORS = {
//     primary: "#0C4299",
//     primaryLight: "#E6F0FA",
//     textPrimary: "#FFFFFF",
//     textSecondary: "#333333",
//     bg: "#F9F9F9",
//     border: "#E0E0E0",
// };

// export const styles = StyleSheet.create({

//     previewExamContainer: {
//         flex: 1,
//         backgroundColor: COLORS.bg,
//         paddingHorizontal: 16,
//         paddingTop: 12,
//         paddingBottom: 24,
//     },

//     loadingContainer: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: 20,
//     },
//     emptyContainer: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: 20,
//     },
//     emptyText: {
//         color: COLORS.textSecondary,
//         fontSize: 14,
//     },
//     accentColor: {
//         color: COLORS.primary,
//     },

//     partWrapper: {
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//         borderRadius: 8,
//         overflow: "hidden",
//         backgroundColor: "#FFF",
//     },

//     partHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: COLORS.primaryLight,
//         paddingVertical: 10,
//         paddingHorizontal: 12,
//     },
//     partHeaderActive: {
//         backgroundColor: COLORS.primary,
//     },
//     partTitle: {
//         color: COLORS.textSecondary,
//         fontSize: 15,
//         fontWeight: "600",
//     },
//     partArrow: {
//         color: COLORS.textSecondary,
//         fontSize: 12,
//     },

//     partTitleActive: {
//         color: COLORS.textPrimary,
//     },
//     partArrowActive: {
//         color: COLORS.textPrimary,
//     },
//     partContent: {
//         padding: 12,
//     },

//     questionWrapper: {
//         marginBottom: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: COLORS.border,
//         paddingBottom: 8,
//     },

//     questionTitle: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: COLORS.textSecondary,
//         marginBottom: 6,
//     },

//     optionRow: {
//         flexDirection: "row",
//         alignItems: "flex-start",
//         marginBottom: 4,
//     },

//     optionLabel: {
//         width: 20, // để các ký tự A., B., … căn lề
//         fontSize: 13,
//         fontWeight: "600",
//         color: COLORS.textSecondary,
//     },

//     optionText: {
//         flex: 1,
//         fontSize: 13,
//         color: COLORS.textSecondary,
//     },
// });
