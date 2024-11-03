import { getUserDetail } from "@/apis/userDetail";
import { useQuery } from "@tanstack/react-query";

export const useUserDetail = (examId: number, userId: number) => {
  return useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => getUserDetail(examId, userId),
  });
};
