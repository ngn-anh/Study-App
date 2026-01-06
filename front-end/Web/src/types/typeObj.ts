export type Subject = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  image?: any;
  status?: number;
};

// export type Exam = {
//     _id: string,
//     subjectId?: string,
//     name?: string,
//     description?: string,
//     type?: string,
//     image?: string,
//     difficulty?: number,
//     duration?: number,
//     number?: number,
//     // participants?: number,
//     // likes?: number;
//     created_at?: string,
//     updated_at?: string,
//     deleted_at?: string,
// };

export type Exam = {
  _id: string;
  subject_class_id?: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  difficulty?: number;
  duration?: number;
  start_date?: Date;
  end_date?: Date;
  total_download?: number;
  subject?: any;
  participants?: number;
  numberQuestion?: number;
  is_done?: boolean;
  total_like?: number;
  is_liked?: number;
  // participants?: number,
  // likes?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  full_name?: string | null;
  class_id: string;
  role: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type UserInfo = {
  token: string;
  refreshToken: string;
  user: User;
};

export type Class = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  status?: number;
};

export type Answer = {
  _id: string;
  question_id?: string;
  description: string;
  image?: string | null;
  is_correct: boolean;
  explanation?: string;
};

export type Question = {
  _id: string;
  exam_id: string;
  image?: string | null;
  description: string;
  difficulty?: number;
  section?: number;
  answers?: Answer[];
};

export type ExamHistory = {
  exam_result_id: string;
  exam_id: string;
  user_id: string;
  total_question: number;
  total_correct: number;
  total_wrong: number;
  total_not_done: number;
  is_finish: boolean;
  time_start?: string;
  time_end?: string;
  durationSec?: number;
  duration_text?: string;
};

export interface ImportAnswer {
  description: string;
  explanation?: string;
  is_correct: boolean;
}

export interface ImportQuestion {
  description: string;
  difficulty: number;
  section: number;
  answers: ImportAnswer[];
}
