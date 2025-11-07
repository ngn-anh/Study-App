import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
     fontSize: 18,
    fontWeight: "700",
    color: "#083070",
    marginLeft: 8,
  },
  resultBadge: {
    backgroundColor: "#E5F7E9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  resultText: {
    color: "#00B42A",
    fontWeight: "600",
    fontSize:16
  },
  button: {
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
