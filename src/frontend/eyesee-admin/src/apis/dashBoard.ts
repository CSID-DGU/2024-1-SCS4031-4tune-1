import { testType } from "@/types/test";
import { api } from ".";
import { testSesstion } from "@/types/user";

export const getDashboardData = async (
  examId: number
): Promise<testSesstion> => {
  const response = await api.get(`/exams/${examId}/sessions`);
  return response.data;
};
