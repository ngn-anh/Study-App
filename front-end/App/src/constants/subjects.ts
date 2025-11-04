export const SUBJECTS = {
  MATH: { code: "MATH", name: "Toán học" },
  LIT: { code: "LIT", name: "Ngữ văn" },
  ENG: { code: "ENG", name: "Tiếng Anh" },
  CHEM: { code: "CHEM", name: "Hóa học" },
  HIS: { code: "HIS", name: "Lịch sử" },
  PHY: { code: "PHY", name: "Vật lý" },
  GEO: { code: "GEO", name: "Địa lý" },
  BIO: { code: "BIO", name: "Sinh học" },
  CIVIC: { code: "CIVIC", name: "Giáo dục công dân" },
} as const;

export type SubjectCode = keyof typeof SUBJECTS;
