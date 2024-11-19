import { ExamRequest, ExamResponse } from "@/types/exam";
import { api } from ".";
import { RESTYPE } from "@/types/common";

export const addExam = async (
  data: ExamRequest
): Promise<RESTYPE<ExamResponse>> => {
  const response = await api.post(`/exams`, data);
  return response.data;
};
