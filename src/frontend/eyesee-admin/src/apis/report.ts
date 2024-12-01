import { api } from ".";
import { RESTYPE } from "@/types/common";
import { ReportResponse } from "@/types/report";

export const getReportData = async (
  examId: number
): Promise<RESTYPE<ReportResponse>> => {
  const response = await api.get(`/exams/${examId}/report`);
  return response.data;
};

// TODO: save response to file
export const downloadReport = async (examId: number) => {
  const response = await api.get(`/exams/${examId}/report/download`);
  return response.data;
};
