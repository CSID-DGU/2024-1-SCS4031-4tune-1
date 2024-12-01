import { api } from ".";
import { timeLineType } from "@/types/timeLine";
import { RESTYPE } from "@/types/common";

export const getUserDetail = async (
  examId: string,
  userId: string
): Promise<RESTYPE<timeLineType>> => {
  const response = await api.get(`/exams/${examId}/users/${userId}`);
  return response.data;
};
