import UserSection from "@/components/dashBoard/UserSection";
import { testSesstionData } from "@/types/user";
import React from "react";

const DashBoardPage = () => {
  const sessionData = testSesstionData;

  return (
    <div>
      <UserSection users={sessionData.user} />
    </div>
  );
};

export default DashBoardPage;
