import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserIdStore = {
  userId: number | null;
  setUserId: (newUserId: number) => void;
};

export const useUserIdStore = create(
  persist<UserIdStore>(
    (set) => ({
      userId: null,
      setUserId: (newUserId) => set({ userId: newUserId }),
    }),
    {
      name: "userId-storage", // localStorage에 저장될 키 이름
    }
  )
);
