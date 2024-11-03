import DashBoardSection from "@/components/dashBoard/DashBoardSection";
import UserSection from "@/components/dashBoard/UserSection";
import { testSesstionData } from "@/types/user";
import React from "react";

const DashBoardPage = () => {
  const sessionData = testSesstionData;

  return (
    <div className="flex h-screen min-w-screen overflow-scroll">
      <UserSection sessionData={sessionData} />
      <DashBoardSection sesstionData={sessionData} />
    </div>
  );
};

export default DashBoardPage;
