export type ExamRequest = {
  examCode: string;
};

export type ExamResponse = {
  examId: number;
  examName: string;
  examSemester: string;
  examStudentNumber: number;
  examLocation: string;
  examDate: string;
  examStartTime: string;
  examDuration: number;
  examStatus: string;
  examNotice: string;
  sessionId: number;
  examRandomCode: string;
  adminName: string;
  examQuestionNumber: number;
  examTotalScore: number;
};

export const InitialExamResponse = {
  examId: 1,
  examName: "융합캡스톤디자인",
  examSemester: "24-2",
  examStudentNumber: 30,
  examLocation: "정보문화관",
  examDate: "2024-11-20",
  examStartTime: "14:30",
  examDuration: 120,
  examStatus: "INPROGRESS",
  examNotice: "notice!!!!!",
  sessionId: 1,
  examRandomCode: "d1213jfaj3",
  adminName: "Admin1",
  examQuestionNumber: 10,
  examTotalScore: 100,
};

export type UserInfoRequest = {
  examCode: string;
  name: string;
  department: string;
  userNum: number;
  seatNum: number;
};

export type UserInfoResponse = {
  userId: number;
  examId: number;
  access_token: string;
  refresh_token: string;
};
