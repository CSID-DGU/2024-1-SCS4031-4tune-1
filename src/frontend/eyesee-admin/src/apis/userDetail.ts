import { testType } from "@/types/test";
import { api } from ".";
import { testSesstion } from "@/types/user";
import { timeLineType } from "@/types/timeLine";

export const getUserDetail = async (
  examId: number,
  userId: number
): Promise<timeLineType> => {
  const response = await api.get(`/exams/${examId}/sessions/${userId}`);
  return response.data;
};
