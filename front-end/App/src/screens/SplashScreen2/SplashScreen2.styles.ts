import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: verticalScale(170),
  },
  logo: {
    width: scale(500), // to hơn
    height: verticalScale(180),
    marginBottom: verticalScale(30),
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  logoText: {
    fontSize: fontScale(72),
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
    marginRight: 5
  },
  appName: {
    fontSize: fontScale(28),
    color: "#fff",
    fontWeight: "500",
  },
  loadingText: {
    color: "#fff",
    fontSize: fontScale(14),
    marginTop: verticalScale(8),
  },
  version: {
    position: "absolute",
    bottom: verticalScale(20),
    color: "#fff",
    fontSize: fontScale(12),
    opacity: 0.8,
  },
});
