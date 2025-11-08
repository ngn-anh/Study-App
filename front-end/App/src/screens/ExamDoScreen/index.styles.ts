import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
     fontSize: 18,
    fontWeight: "700",
    color: "#083070",
    marginLeft: 8,
  },
  examTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#0C4299",
    marginHorizontal: 10,
  },
  submitBtn: {
     fontSize: 18,
    fontWeight: "700",
    color: "#083070",
  },
  questionContainer: {
    flex: 1,
    marginTop: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#083070",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  optionSelected: {
    backgroundColor: "#EBF2FF",
    borderColor: "#0C4299",
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  optionTextSelected: {
    color: "#0C4299",
    fontWeight: "700",
  },
  skipText: {
    color: "#000",
    fontSize:18,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 25,
  },
  pageDot: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pageDotActive: {
    borderColor: "#0C4299",
    backgroundColor: "#E7EDFF",
  },
  pageDotAnswered: {
    backgroundColor: "#d0fdd8ff",
    borderColor: "#d0fdd8ff",
    color:"#fff",
  },
  pageDotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  navButtons: {
  flexDirection: "row",
  gap:20,
  marginTop: 16,
  marginBottom: 20,
},
navBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
  marginHorizontal: 4,
},
skipBtn: {
  backgroundColor: "#F0F0F0",
},
nextBtn: {
  flexDirection:"row",
  alignItems: "center",
  textAlign:"center",
  justifyContent:"center",
  backgroundColor: "#0C4299",
},
navBtnText: {
  fontSize: 16,
  fontWeight: 500,
  color: "#fff",
  marginRight:5,
},
skipBtnText: {
  color: "#000",
},
});
