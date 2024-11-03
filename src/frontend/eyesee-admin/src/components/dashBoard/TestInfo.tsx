import React, { ReactNode } from "react";

type TestInfoProps = {
  examName: string;
  examDuration: number;
  children?: ReactNode;
};

const TestInfo = ({ examName, examDuration, children }: TestInfoProps) => {
  return (
    <>
      <div>
        <p className="text-[20px] font-bold">{examName}</p>
        <p className="text-[18px] font-bold">🕐 {examDuration}분</p>
      </div>
      <div className="w-full flex justify-end items-center gap-5 mb-5">
        {children}
      </div>
    </>
  );
};

export default TestInfo;
