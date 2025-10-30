import { StyleSheet } from "react-native";
import { scale, verticalScale, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: verticalScale(170), // đẩy nội dung lên cao hơn
  },
  logoImage: {
    width: scale(500), // to hơn
    height: verticalScale(180),
    marginBottom: verticalScale(30),
  },
  logoContainer: {
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
    fontSize: fontScale(48),
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Poppins-Light", // chữ mềm hơn
  },
  subtitle: {
    fontSize: fontScale(16),
    color: "#fff",
    marginTop: verticalScale(10),
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});
