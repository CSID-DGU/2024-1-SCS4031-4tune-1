import { getBeforeExamList } from "@/apis/examList";
import { useQuery } from "@tanstack/react-query";

export const useBeforeExam = () => {
  return useQuery({
    queryKey: ["exam", "before"],
    queryFn: getBeforeExamList,
  });
};
