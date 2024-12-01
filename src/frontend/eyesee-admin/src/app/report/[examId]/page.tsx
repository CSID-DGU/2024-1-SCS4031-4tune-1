"use client";

import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import ReportSection from "@/components/report/ReportSection";
import { useDashboarReportdData } from "@/hooks/api/useDashboard";
import { useReportdData } from "@/hooks/api/useReport";
import { useParams } from "next/navigation";

const ReportPage = () => {
  const { examId } = useParams();
  const { data: dashboard } = useDashboarReportdData(Number(examId));
  const { data: report } = useReportdData(Number(examId));

  return (
    <>
      {dashboard && report && (
        <div className="flex min-h-screen w-screen bg-[##0E1D3C]">
          <UserSection sessionData={dashboard.data} />
          <DashBoardSection sesstionData={dashboard.data}>
            <ReportSection reportData={report} />
          </DashBoardSection>
        </div>
      )}
    </>
  );
};

export default ReportPage;
