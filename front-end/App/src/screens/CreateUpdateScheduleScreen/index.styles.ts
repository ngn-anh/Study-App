import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 20,
    color: "#083070",
    fontWeight: "600",
  },
  label: {
    marginBottom: 6,
    marginTop: 16,
    color: "#083070",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#C8D3F5",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputRow: {
    borderWidth: 1,
    borderColor: "#C8D3F5",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    color: "#333",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#0C4299",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
