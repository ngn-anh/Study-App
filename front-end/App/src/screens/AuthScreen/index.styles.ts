import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    width: "100%",
    height: height * 0.38,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  loginButton: {
    backgroundColor: "#0047AB",
    width: width * 0.8,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#E8F0FF",
    width: width * 0.8,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
   /* container bên trong để xếp icon + text ngang và canh giữa */
  registerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    color: "#0047AB",
    fontSize: 16,
    fontWeight: "600",
  },
});
