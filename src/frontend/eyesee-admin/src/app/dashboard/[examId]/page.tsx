import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import { testSesstionData } from "@/types/user";
import React from "react";

const DashBoardPage = () => {
  const sessionData = testSesstionData;

  return (
    <div className="flex min-h-screen w-screen bg-[##0E1D3C]">
      <UserSection sessionData={sessionData} />
      <DashBoardSection sesstionData={sessionData} />
    </div>
  );
};

export default DashBoardPage;
