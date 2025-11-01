import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
 container: { 
    flex: 1, 
    backgroundColor: "#0C4299"
},
  header: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#fff"
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#fff" },
  card: {
    backgroundColor: "#1E3C72",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 8 },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap:40,
    marginVertical: 10,
  },
  timeBox: { alignItems: "center" },
  timeValue: { color: "#fff", fontSize: 40, fontWeight: "700" },
  timeLabel: { color: "#fff", fontSize: 20, opacity: 0.8 , fontWeight: "600" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  dateText: { color: "#fff", fontSize: 13, marginLeft: 6, fontWeight:500 },
  quoteBox: { marginHorizontal: 30, marginTop: 10 },
  quoteText: { color: "#fff", textAlign: "center", fontSize: 14, opacity: 0.9 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E3C72",
  },
  errorText: { color: "#fff", fontSize: 16 },
});
