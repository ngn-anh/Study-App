import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#083070",
    marginLeft: 8,
  },
  body: {
    flex: 1,
  },
  // image: {
  //   width: "100%",
  //   height: 180,
  //   borderRadius: 12,
  //   marginBottom: 16,
  // },
  // statusRow: {
  //   flexDirection: "row",
  //   gap: 18,
  //   alignItems: "center",
  //   marginBottom: 30,
  // },
  // statusItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 6,
  // },
  // statusText: {
  //   fontSize: 13,
  //   color: "#0C4299",
  // },
  // instructionBox: {
  //   backgroundColor: "#fff",
  //   borderRadius: 12,
  //   padding: 16,
  //   marginBottom: 30,
  //   shadowColor: "#000",
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   shadowOffset: { width: 0, height: 2 },
  //   elevation: 3,
  // },
  // subTitle: {
  //   fontSize: 14,
  //   fontWeight: "700",
  //   color: "#0C4299",
  //   marginBottom: 20,
  //   letterSpacing: 0.3
  // },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  // circle: {
  //   width: 22,
  //   height: 22,
  //   borderRadius: 50,
  //   borderWidth: 2,
  //   borderColor: "#B9D2FA",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginRight: 12,
  //   marginTop: 2,
  // },
  // circleText: {
  //   color: "#B9D2FA",
  //   fontSize: 13,
  //   fontWeight: "600",
  // },
  // instructionText: {
  //   flex: 1,
  //   color: "#5D697E",
  //   fontSize: 13,
  //   lineHeight: 18,
  // },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 16,
    shadowColor: "#0C4299",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
