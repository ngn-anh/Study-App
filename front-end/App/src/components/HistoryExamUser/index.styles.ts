import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  historyItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    gap: 28,
  },

  scoreBox: {
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
  },

  detailContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 3,
    paddingVertical: 4,
  },

  detailItem: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  timeLine: {
    color: "#000000",
    fontSize: 14,
  },

  progressWrapper: {
    marginTop: 13,
    position: "relative",
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBackground: {
    flexDirection: "row",
    height: "100%",
    backgroundColor: "#89B5FB",
  },
  progressDone: {
    backgroundColor: "#0C4299",
  },
  progressRemain: {
    backgroundColor: "#89B5FB",
  },
  progressLabelOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  statItem: {
    marginTop: 10,
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 8,
    backgroundColor: "#F2EDED",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "30%",
    gap: 7,
  },

  statLeft: {
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },

  statIcon: {
    width: 15,
    height: 15,
    marginRight: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "#000000",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  errorText: {
    color: "#EE0033",
    marginVertical: 20,
    fontSize: 14,
    textAlign: "center",
  },

  levelHeader: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },

  levelText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  historyContent: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
});
