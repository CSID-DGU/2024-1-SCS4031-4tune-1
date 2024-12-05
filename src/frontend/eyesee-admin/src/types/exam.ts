import { MonitoringCondition } from "@/constant/monitoring";

export type ExamRequest = {
  examName: string;
  examSemester: string;
  examStudentNumber: number;
  examLocation: string;
  examDate: string;
  examStartTime: string;
  examDuration: number;
  examQuestionNumber: number;
  examTotalScore: number;
  examNotice: string;
  cheatingTypes: string[];
};

export const initialExamData: ExamRequest = {
  examName: "",
  examSemester: "",
  examStudentNumber: 0,
  examLocation: "",
  examDate: "",
  examStartTime: "",
  examDuration: 0,
  examQuestionNumber: 0,
  examTotalScore: 0,
  examNotice: "",
  cheatingTypes: [
    MonitoringCondition.NOT_LOOKING_AROUND,
    MonitoringCondition.REPEATED_GAZE,
    MonitoringCondition.DEVICE_DETECTION,
    MonitoringCondition.OFF_SCREEN,
    MonitoringCondition.FREQUENT_OFF_SCREEN,
    MonitoringCondition.REPEATED_HAND_GESTURE,
    MonitoringCondition.TURNING_AWAY,
    MonitoringCondition.SPECIFIC_POSITION_BEHAVIOR,
  ],
};

export type ExamResponse = {
  examRandomCode: string;
};
