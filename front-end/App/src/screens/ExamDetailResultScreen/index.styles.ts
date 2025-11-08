import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 18, 
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
 
  headerTitle: {fontSize: 18,
    fontWeight: "700",
    color: "#083070",
    marginLeft: 8,
   },

  questionCard: {
    backgroundColor: "#F3F8FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: "100%", height: 150, resizeMode: "contain", marginBottom: 12 },
  optionRow: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  optionText: { fontSize: 14 },
  correctOption: { backgroundColor: "#d4edda", borderColor: "#28a745" },
  wrongOption: { backgroundColor: "#f8d7da", borderColor: "#dc3545" },
  explanationBox: {
    backgroundColor: "#e9ecef",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  explanationTitle: { fontWeight: "600", marginBottom: 4 },
  explanationText: { fontSize: 14 },
});
