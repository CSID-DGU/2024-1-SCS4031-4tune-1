import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  userId: number | null;
  examId: number | null;
  setUserId: (newUserId: number) => void;
  setExamId: (newExamId: number) => void;
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      userId: null,
      examId: null,
      setUserId: (newUserId) => set({ userId: newUserId }),
      setExamId: (newExamId) => set({ examId: newExamId }),
    }),
    {
      name: "user-storage", // localStorage에 저장될 키 이름
    }
  )
);
