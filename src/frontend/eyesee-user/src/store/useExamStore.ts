import { ExamResponse, InitialExamResponse } from "@/types/exam";
import { create } from "zustand";

type ExamStore = {
  exam: ExamResponse;
  setExam: (exam: ExamResponse) => void;
};

export const useExamStore = create<ExamStore>((set) => ({
  exam: InitialExamResponse,
  setExam: (exam) => set({ exam }),
}));
