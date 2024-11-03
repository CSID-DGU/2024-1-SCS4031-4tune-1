import { getDashboardData } from "@/apis/dashBoard";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = (examId: number) => {
  return useQuery({
    queryKey: ["dashboard", examId],
    queryFn: () => getDashboardData(examId),
  });
};
