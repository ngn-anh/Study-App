import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FF",
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#083070",
    marginLeft: 8,
  },
  trashButton: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  trashCount: {
    fontSize: 13,
    color: "#E53935",
    marginLeft: 4,
    fontWeight: "500",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0A2A66",
  },
  cardDate: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  cardTag: {
    backgroundColor: "#E8F8EE",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardTagText: {
    fontSize: 11,
    color: "#1D9A40",
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    right: 20,
    alignSelf: "center",
    backgroundColor: "#0C4299",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 4,
  },
  addText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: "#B0C4DE",
  },
   block:{
    height:100
  }
});
