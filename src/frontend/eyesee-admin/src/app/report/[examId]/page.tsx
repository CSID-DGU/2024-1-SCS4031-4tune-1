"use client";

import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import ReportSection from "@/components/report/ReportSection";
import { useDashboarReportdData } from "@/hooks/api/useDashboard";
import { useReportdData } from "@/hooks/api/useReport";
import { useParams } from "next/navigation";

const ReportPage = () => {
  // TODO: 서버 데이터 연결
  const { examId } = useParams();
  const dashboard = useDashboarReportdData(Number(examId));
  const report = useReportdData(Number(examId));

  return (
    <>
      {dashboard.data && report.data && (
        <div className="flex min-h-screen w-screen bg-[##0E1D3C]">
          <UserSection sessionData={dashboard.data.data} />
          <DashBoardSection sesstionData={dashboard.data.data}>
            <ReportSection reportData={report.data.data} />
          </DashBoardSection>
        </div>
      )}
    </>
  );
};

export default ReportPage;
