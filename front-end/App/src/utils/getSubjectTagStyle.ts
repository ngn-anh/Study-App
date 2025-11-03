import { SubjectCode } from "../constants/subjects";

export const getSubjectTagStyle = (subjectCode: SubjectCode) => {
  switch (subjectCode) {
    case "MATH":
      return { backgroundColor: "#FBE8E9", color: "#D72229" };
    case "LITERATURE":
      return { backgroundColor: "#FEF1E8", color: "#F57921" };
    case "ENGLISH":
      return { backgroundColor: "#E7F0FD", color: "#1669EF" };
    case "GEOGRAPHY":
      return { backgroundColor: "#E5F7E9", color: "#00B42A" };
    default:
      return { backgroundColor: "#EEE", color: "#333" };
  }
};
