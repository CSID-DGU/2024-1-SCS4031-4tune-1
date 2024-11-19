import { api } from ".";
import { RESTYPE } from "@/types/common";
import { ExamRequest, ExamResponse } from "@/types/exam";

export const enterSession = async (
  data: ExamRequest
): Promise<RESTYPE<ExamResponse>> => {
  const response = await api.post(`/sessions/join`, data);
  return response.data;
};
