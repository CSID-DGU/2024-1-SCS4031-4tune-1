import { addExam } from "@/apis/exam";
import { useTestCodeStore } from "@/store/useTestCodeStore";
import { RESTYPE } from "@/types/common";
import { ExamResponse } from "@/types/exam";
import { useMutation } from "@tanstack/react-query";

export const useAddExam = (onSuccess: void) => {
  const { setExamRandomCode } = useTestCodeStore();
  return useMutation({
    mutationFn: addExam,
    onSuccess: (data: RESTYPE<ExamResponse>) => {
      setExamRandomCode(data.data.examRandomCode);
      onSuccess;
    },
    onError: () => {
      console.log("시험 생성 중 오류가 발생했습니다.");
    },
  });
};
