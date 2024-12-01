import { api } from ".";
import { RESTYPE } from "@/types/common";
import { ReportResponse } from "@/types/report";

export const getReportData = async (
  examId: number
): Promise<ReportResponse> => {
  // ): Promise<RESTYPE<ReportResponse>> => {
  const response = await api.get(`/exams/${examId}/report`);
  return response.data;
};

// TODO: save response to file
export const downloadReport = async (examId: number) => {
  const response = await api.get(`/exams/${examId}/report/download`);
  return response.data;

  //   if (!response.ok) {
  //     throw new Error("Failed to download the file");
  //   }

  //   const blob = await response.blob();
  //   const url = window.URL.createObjectURL(blob);

  //   // Create a hidden anchor element to trigger download
  //   const link = document.createElement("a");
  //   link.href = url;

  //   // Set a default file name for the download
  //   link.download = `report-${sessionId}.xlsx`;
  //   document.body.appendChild(link);
  //   link.click();

  //   // Cleanup
  //   link.remove();
  //   window.URL.revokeObjectURL(url);
  // } catch (error) {
  //   console.error("Error downloading the file:", error);
  // }
};
