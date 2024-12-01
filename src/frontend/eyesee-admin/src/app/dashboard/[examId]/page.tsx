"use client";

import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import { useDashboardData } from "@/hooks/api/useDashboard";
import { testSesstion } from "@/types/user";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DashBoardPage = () => {
  const { examId } = useParams();
  const [sessionData, setSessionData] = useState<testSesstion>();

  // 시험 대시보드 데이터 호출
  const { data } = useDashboardData(Number(examId));

  useEffect(() => {
    if (data) {
      // 좌석번호 오름차순 정렬
      const sortedData = [...data.data.user].sort(
        (a, b) => a.seatNum - b.seatNum
      );

      setSessionData({
        ...data.data,
        user: sortedData,
      });
    }
  }, [data]);

  return (
    <>
      {sessionData ? (
        <div className="flex min-h-screen w-screen bg-[##0E1D3C]">
          <UserSection sessionData={sessionData} />
          <DashBoardSection sesstionData={sessionData} />
        </div>
      ) : (
        <div>로딩 중</div>
      )}
    </>
  );
};

export default DashBoardPage;
