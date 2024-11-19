import { ExamResponse, InitialExamResponse } from "@/types/exam";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExamStore = {
  exam: ExamResponse;
  setExam: (exam: ExamResponse) => void;
};

export const useExamStore = create(
  persist<ExamStore>(
    (set) => ({
      exam: InitialExamResponse,
      setExam: (exam) => set({ exam }),
    }),
    {
      name: "exam-storage", // localStorage에 저장될 키 이름
    }
  )
);
