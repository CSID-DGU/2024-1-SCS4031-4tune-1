import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserIdStore = {
  userId: number;
  setUserId: (userId: number) => void;
};

export const useUserIdStore = create(
  persist<UserIdStore>(
    (set) => ({
      userId: 1,
      setUserId: (userId) => set({ userId }),
    }),
    {
      name: "userId-storage", // localStorage에 저장될 키 이름
    }
  )
);
