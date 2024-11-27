"use client";

import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import { useDashboardData } from "@/hooks/api/useDashboard";
import { testSesstion, testSesstionData } from "@/types/user";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DashBoardPage = () => {
  const { examId } = useParams();
  const [sessionData, setSessionData] =
    useState<testSesstion>(testSesstionData);
  const { data } = useDashboardData(Number(examId));

  useEffect(() => {
    if (data && data.data.user.length > 0) {
      const sortedData = [...data.data.user].sort(
        (a, b) => a.seatNum - b.seatNum
      );
      setSessionData({ ...sessionData, user: sortedData });
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
