import { addExam } from "@/apis/exam";
import { useMutation } from "@tanstack/react-query";

export const useAddExam = (onSuccess: void) => {
  return useMutation({
    mutationFn: addExam,
    onSuccess: () => {
      onSuccess;
    },
    onError: () => {
      console.log("시험 생성 중 오류가 발생했습니다.");
    },
  });
};
