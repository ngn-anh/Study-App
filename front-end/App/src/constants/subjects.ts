export const SUBJECTS = {
  MATH: { code: "MATH", name: "Toán học" },
  LITERATURE: { code: "LITERATURE", name: "Ngữ văn" },
  ENGLISH: { code: "ENGLISH", name: "Tiếng Anh" },
  HISTORY: { code: "HISTORY", name: "Lịch sử" },
  GEOGRAPHY: { code: "GEOGRAPHY", name: "Địa lý" },
} as const;

export type SubjectCode = keyof typeof SUBJECTS;
