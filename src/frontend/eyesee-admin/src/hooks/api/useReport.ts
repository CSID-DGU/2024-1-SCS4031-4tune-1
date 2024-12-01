import { getDashboardData } from "@/apis/dashBoard";
import { downloadReport, getReportData } from "@/apis/report";
import { useQuery } from "@tanstack/react-query";

export const useDashboarReportdData = (examId: number) => {
  return useQuery({
    queryKey: ["dashboard", examId],
    queryFn: () => getDashboardData(examId),
  });
};

export const useReportdData = (examId: number) => {
  return useQuery({
    queryKey: ["report", examId],
    queryFn: () => getReportData(examId),
  });
};

export const useDownloadReport = (examId: number) => {
  return useQuery({
    queryKey: ["report_download", examId],
    queryFn: () => downloadReport(examId),
  });
};
