"use client";

import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import ReportSection from "@/components/report/ReportSection";
import { useDashboarReportdData } from "@/hooks/api/useDashboard";
import { useReportdData } from "@/hooks/api/useReport";
import { testSesstion } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ReportPage = () => {
  const { examId } = useParams();
  const [dashboard, setDashboard] = useState<testSesstion>();
  const { data } = useDashboarReportdData(Number(examId));
  const { data: report } = useReportdData(Number(examId));

  useEffect(() => {
    if (data) {
      // 좌석번호 오름차순 정렬
      const sortedData = [...data.data.user].sort(
        (a, b) => a.seatNum - b.seatNum
      );

      setDashboard({
        ...data.data,
        user: sortedData,
      });
    }
  }, [data]);

  return (
    <>
      {dashboard && report && (
        <div className="flex min-h-screen w-screen bg-[##0E1D3C]">
          <UserSection sessionData={dashboard} />
          <DashBoardSection sesstionData={dashboard}>
            <ReportSection reportData={report} />
          </DashBoardSection>
        </div>
      )}
    </>
  );
};

export default ReportPage;
