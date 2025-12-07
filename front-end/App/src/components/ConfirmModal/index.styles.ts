export const a='2';
// src/components/confirmModal.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(99, 99, 99, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#083070',
    textAlign: 'left',
    marginBottom: 20,
  },
  content: {
    fontSize: 13,
    color: '#081834',
    textAlign: 'left',
    marginBottom: 25,
    lineHeight: 18,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
     width: "100%",
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#083070",
    marginRight: 8,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#083070",
    marginLeft: 8,
  },
  cancelText: {
    color: "#083070",
    textAlign: "center",
    fontWeight: "500",
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
});
