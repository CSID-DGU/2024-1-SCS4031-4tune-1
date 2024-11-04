import { getUserDetail } from "@/apis/userDetail";
import { useQuery } from "@tanstack/react-query";

export const useUserDetail = (examId: string, userId: string) => {
  return useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => getUserDetail(examId, userId),
  });
};
