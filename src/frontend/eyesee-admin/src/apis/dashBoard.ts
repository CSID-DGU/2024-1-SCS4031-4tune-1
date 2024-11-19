import { api, apiWithoutAuth } from ".";
import { testSesstion } from "@/types/user";
import { RESTYPE } from "@/types/common";

export const getDashboardData = async (
  examId: number
): Promise<RESTYPE<testSesstion>> => {
  const response = await api.get(`/exams/${examId}/sessions`);
  return response.data;
};
