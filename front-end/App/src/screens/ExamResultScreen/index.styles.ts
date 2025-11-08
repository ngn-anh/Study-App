import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#083070" },

  resultContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  resultPercent: { fontSize: 28, fontWeight: "bold", color: "#083070" },
  resultMessage: {
    marginTop: 30,
    fontSize: 17,
    fontWeight: "600",
    color: "#083070",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    marginBottom: 30,
    backgroundColor:"#ECF3FF",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius:12,
  },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#083070" ,marginTop: 8},
  statLabel: { fontSize: 12, color: "#666",marginTop: 6 },

  button: {
    borderRadius: 12,
    marginTop: 24,
    overflow: "hidden",
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
