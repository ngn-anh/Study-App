import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },

  // Header
  headerBackground: {
    width: width,
    height: height * 0.35,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  overlayContent: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 20,
  },

  // Form
  formContainer: {
    padding: 25,
    paddingBottom: 50,
  },
  label: {
    fontSize: 14,
    color: "#5D697E",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
    color: "#333",
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
    marginBottom: 15,
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  iconEye: {
    position: "absolute",
    right: 15,
    top: "30%",
  },

  // Buttons
  registerButton: {
    backgroundColor: "#EBF2FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#0047AB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8
  },
  registerText: {
    color: "#0C4299",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Support
   supportContainer: {
   alignItems: "center",
    marginBottom: 25,
  },
  supportLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportText: {
    color: "#1669EF",
    fontWeight: "500",
    fontSize: 14,
  },
});
