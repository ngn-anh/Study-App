import { SubjectCode } from "../constants/subjects";

export const getSubjectTagStyle = (subjectCode: SubjectCode) => {
  switch (subjectCode) {
    case "MATH":
      return { backgroundColor: "#FBE8E9", color: "#D72229" };
    case "LIT":
      return { backgroundColor: "#FEF1E8", color: "#F57921" };
    case "ENG":
      return { backgroundColor: "#E7F0FD", color: "#1669EF" };
    case "CHEM":
      return { backgroundColor: "#E5F7E9", color: "#00B42A" };
    case "HIS":
      return { backgroundColor: "#FFF8E1", color: "#DCA40B" };
    case "PHY":
      return { backgroundColor: "#F0E6FF", color: "#8B5CF6" };
    case "GEO":
      return { backgroundColor: "#E0F2F1", color: "#00796B" };
    case "BIO":
      return { backgroundColor: "#EAFBE7", color: "#1B8F21" };
    case "CIVIC":
      return { backgroundColor: "#E3F2FD", color: "#1565C0" };
    default:
      return { backgroundColor: "#EEE", color: "#333" };
  }
};
