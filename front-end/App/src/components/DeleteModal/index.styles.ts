import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   overlay: {
    flex: 1,
    backgroundColor: "rgba(116, 115, 115, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#E53935",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  content: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
    textAlign: "left", // căn trái
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end", // lệch sang phải
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  deleteButton: {
    backgroundColor: "#E53935",
  },
  cancelText: {
    color: "#333",
    fontWeight: "500",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});