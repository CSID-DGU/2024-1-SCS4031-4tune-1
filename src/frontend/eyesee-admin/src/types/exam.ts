export type ExamRequest = {
  examName: string;
  examSemester: string;
  examStudentNumber: number;
  examLocatoin: string;
  examDate: string;
  examStartTime: string;
  examDuration: number;
  examQuestionNumber: number;
  examTotalScore: number;
  examNotice: string;
};

export const initialExamData = {
  examName: "",
  examSemester: "",
  examStudentNumber: 0,
  examLocatoin: "",
  examDate: "",
  examStartTime: "",
  examDuration: 0,
  examQuestionNumber: 0,
  examTotalScore: 0,
  examNotice: "",
};

export type ExamResponse = {
  examRandomCode: string;
};
