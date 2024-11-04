import { testType } from "@/types/test";
import { api } from ".";
import { RESTYPE } from "@/types/common";

export const getBeforeExamList = async (): Promise<RESTYPE<testType[]>> => {
  const response = await api.get("/exams/before");
  return response.data;
};

export const getInProgressExamList = async (): Promise<RESTYPE<testType[]>> => {
  const response = await api.get("/exams/in-progress");
  return response.data;
};

export const getDoneExamList = async (): Promise<RESTYPE<testType[]>> => {
  const response = await api.get("/exams/done");
  return response.data;
};
