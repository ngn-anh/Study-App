import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "../../utils/responsive";


export const styles = StyleSheet.create({
    // container: {
    //     borderColor: "#1605b3ff",
    //     borderWidth: 1,
    //     borderRadius: 5,
    // }
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderColor: "#0418f7ff",
        borderWidth: 1,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        // marginTop: verticalScale(40),
        // padding: scale(14),
        // width: verticalScale(345),
       flex: 1, 
       margin: 5,
    },
    image: {
        flex: 1,
        width: "100%",
        height: verticalScale(88),
    },
    content: {
        paddingHorizontal: scale(14),
        marginVertical: verticalScale(12),
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: moderateScale(16),
        color: "#001C64",
        fontWeight: "600",
        flex: 1,
    },
    // subjectTag: {
    //     backgroundColor: "#FFE9E0",
    //     borderRadius: 8,
    //     paddingHorizontal: scale(8),
    //     paddingVertical: verticalScale(2),
    //     marginLeft: scale(8),
    // },
    // subjectText: {
    //     color: "#F97316",
    //     fontSize: moderateScale(12),
    //     fontWeight: "600",
    // },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: verticalScale(10),
    },
    iconInfo: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: "row",
        alignItems: "center",
        marginVertical: verticalScale(10),
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconGroupLink: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: scale(14),
    },
    icon: {
        width: 11,
        height: 11,
        marginRight: 4,
        color: "#5D697E",
        tintColor: "#5D697E",
    },
    iconLink: {
        width: scale(14),
        height: scale(14),
        marginRight: scale(6),
        tintColor: "#1669EF",
    },
    iconText: {
        fontSize: moderateScale(12),
        color: "#5D697E",
    },
    linkText: {
        fontSize: moderateScale(12),
        color: "#1669EF",
        fontWeight: "600",
        marginRight: scale(8),
    },
    button: {
        backgroundColor: "#6B57BE",
        borderRadius: 20,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
    },
    buttonText: {
        color: "#fff",
        fontSize: moderateScale(12),
        fontWeight: "600",
    },
});