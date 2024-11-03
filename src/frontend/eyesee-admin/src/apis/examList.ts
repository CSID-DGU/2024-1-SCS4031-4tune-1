import { testType } from "@/types/test";
import { api } from ".";

export const getBeforeExamList = async (): Promise<testType> => {
  const response = await api.get("/exams/before");
  return response.data;
};
