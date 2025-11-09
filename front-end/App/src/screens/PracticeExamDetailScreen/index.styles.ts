import { StyleSheet } from "react-native";
import { verticalScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F6",
  },

  content: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 10,
    marginVertical: 16,
  },

  infoExamContainer:{
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  imageExam: {
    flex: 1,
    height: verticalScale(160),
  },
  nameExam: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  infoExam: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-between",
    gap: 66,
  },
  infoExamLeft:{
    display:"flex",
    flexDirection: "column",
  },
  itemLeft: {
    display:"flex",
    flexDirection: "row",
  },
  itemIcon: {},
  itemValue: {},
  infoExamRight:{
    display:"flex",
    flexDirection: "row",
    alignItems:"center",
  },
itemRight:{},
itemValueRight: {},
itemDesRight: {},
  actionContainer: {

  },
  previewExamContainer: {

  }
 });
