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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef4fdff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: { flex: 1, fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6FAFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  rank: { fontSize: 16, fontWeight: "bold", width: 25, textAlign: "center",color:"#083070",marginRight: 8 },
  info: { flex: 1, marginLeft: 8 },
  name: { fontSize: 15, fontWeight: "600",marginBottom:4 },
  details: { fontSize: 13, color: "#777", marginRight:15 },
  tagShort: {
    backgroundColor: "#FFEFE0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 12, color: "#E58B00", fontWeight: "600" },
  image:{
    width:42,
    height:42
  }
});
