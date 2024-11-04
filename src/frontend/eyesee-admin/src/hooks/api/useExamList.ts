import {
  getBeforeExamList,
  getDoneExamList,
  getInProgressExamList,
} from "@/apis/examList";
import { useQuery } from "@tanstack/react-query";

export const useBeforeExam = () => {
  return useQuery({
    queryKey: ["exam", "before"],
    queryFn: getBeforeExamList,
  });
};

export const useInProgressExam = () => {
  return useQuery({
    queryKey: ["exam", "inProgress"],
    queryFn: getInProgressExamList,
  });
};

export const useDoneExam = () => {
  return useQuery({
    queryKey: ["exam", "done"],
    queryFn: getDoneExamList,
  });
};
