import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: scale(16),
    marginTop: verticalScale(20), // ✅ không dùng số âm
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: scale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: 28,
    marginRight: scale(12),
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: moderateScale(16),
    color: "#001C64",
    fontWeight: "600",
  },
  email: {
    fontSize: moderateScale(13),
    color: "#666",
    marginTop: verticalScale(2),
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(2),
    borderRadius: 10,
    marginTop: verticalScale(18),
    borderColor: "#1669EF",
    borderWidth: 1,        // thêm viền 1px
    borderStyle: "solid",
  },
  badgeText: {
    color: "#1669EF",
    fontSize: moderateScale(12),
    fontWeight: "700",
  },
});
