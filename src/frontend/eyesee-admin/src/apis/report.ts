import { api } from ".";
import { ReportResponse } from "@/types/report";

export const getReportData = async (
  examId: number
): Promise<ReportResponse> => {
  const response = await api.get(`/exams/${examId}/report`);
  return response.data;
};

// 사후 레포트 엑셀 다운로드
export const downloadReport = async (examId: number) => {
  try {
    const response = await api.get(`/exams/${examId}/report/download`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xlsx";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("엑셀 다운로드 중 에러가 발생했습니다: ", error);
  }
};
