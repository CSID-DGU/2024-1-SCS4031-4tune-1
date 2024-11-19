import { create } from "zustand";

type TestCodeStore = {
  examRandomCode: string;
  setExamRandomCode: (examRandomCode: string) => void;
};

export const useTestCodeStore = create<TestCodeStore>((set) => ({
  examRandomCode: "",
  setExamRandomCode: (examRandomCode) => set({ examRandomCode }),
}));
