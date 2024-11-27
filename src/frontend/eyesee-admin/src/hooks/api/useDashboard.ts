import { getDashboardData } from "@/apis/dashBoard";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = (examId: number) => {
  return useQuery({
    queryKey: ["dashboard", examId],
    queryFn: () => getDashboardData(examId),
    refetchInterval: 3000, // 3초 간격으로 리프레시
    refetchIntervalInBackground: true, // 화면이 포커스되지 않아도 백그라운드에서 리프레시
  });
};
