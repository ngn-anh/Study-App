import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  header: {
    flexDirection: "row",
    marginTop: verticalScale(45),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  option:{
    flexDirection: "row",
    alignItems: "center",
    gap: verticalScale(10),
  },
  username: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  notification: {
    position: "relative",
  },
  bellIcon: {
    width: scale(22),
    height: scale(22),
    tintColor: "#fff",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#F57921",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: moderateScale(10),
    fontWeight: "600",
  },
  examSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(60),
  },
});
