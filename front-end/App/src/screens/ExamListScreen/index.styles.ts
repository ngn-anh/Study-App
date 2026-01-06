import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
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

  // TABS
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#EFF3FF",
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 3,
    margin:6
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    color: "#0C4299",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#0C4299",
    fontWeight: "600",
  },

  // SEARCH BAR
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef4fdff",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop:16,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    marginHorizontal: 8,
    color: "#000",
  },

  // CARD ITEM
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 15,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeft: { marginRight: 12 },
  thumbnail: {
    width: 120,
    height: 84,
    borderRadius: 6,
    backgroundColor: "#EAF1FF",
  },
  cardRight: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600", color: "#083070" },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  time: {
    fontSize: 12,
    color: "#5D697E",
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 3,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  // TAG
  subjectTag: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: "600",
  },

  remindBtn: {
    backgroundColor: "#6B57BE",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  remindText: { fontSize: 12, color: "#fff", fontWeight: "500" },
  joinBtn: {
    backgroundColor: "#1669EF",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  seeBtn: {
    backgroundColor: "#22A112",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  joinText: { fontSize: 12, color: "#fff", fontWeight: "500" },

  filterTag: {
  backgroundColor: "#E8EFFC",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  marginRight: 8,
},
    filterTagText: {
    color: "#083070",
    fontSize: 14,
    fontWeight: "500",
    },
    activeFilterTag: {
    backgroundColor: "#1669EF",
    },
    activeFilterTagText: {
    color: "#fff",
    },
 
resetText: {
  color: "#081834",
  fontWeight: "600",
},

applyText: {
  color: "#0C4299",
  fontWeight: "600",
},
filterContainer: {
  backgroundColor: "#fff",
  marginHorizontal: 16,
  marginTop: 8,
  borderRadius: 12,
  padding: 16,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 3,
  elevation: 2,
},
filterTitle: {
  textAlign: "center",
  fontSize: 16,
  fontWeight: "700",
  color: "#083070",
  marginBottom: 8,
},
filterSectionTitle: {
  fontSize: 11,
  fontWeight: "600",
  color: "#A2ADBF",
  marginTop: 12,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.03
},
filterOption: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: 12,
},
filterOptionText: {
  flex: 1,
  marginLeft: 8,
  fontSize: 15,
  fontWeight: "500",
  color: "#081834",
},
filterButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 16,
},
resetBtn: {
  flex: 1,
  backgroundColor: "#f3f3f5ff",
  paddingVertical: 10,
  borderRadius: 20,
  alignItems: "center",
  marginRight: 8,
},
applyBtn: {
  flex: 1,
  backgroundColor: "#EBF2FF",
  paddingVertical: 10,
  borderRadius: 20,
  alignItems: "center",
  marginLeft: 8,
},

block:{
    height:50
  }
  
});
