import SubHeader from "@/components/common/SubHeader";
import InputTestCode from "@/components/enterTestCode/InputTestCode";
import React from "react";

const enterPage = () => {
  return (
    <div className="bg-white w-screen h-screen">
      <SubHeader title="시험 시작하기" />
      <InputTestCode />
    </div>
  );
};

export default enterPage;
