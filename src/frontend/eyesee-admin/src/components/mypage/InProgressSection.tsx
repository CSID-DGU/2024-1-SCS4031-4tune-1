"use client";

import { testType } from "@/types/test";
import TestCard from "./TestCard";
import { testState } from "@/constant/test";
import { useEffect, useState } from "react";
import { useInProgressExam } from "@/hooks/api/useExamList";

const InProgressSection = () => {
  const { data } = useInProgressExam();
  const [inProgressData, setInProgressData] = useState<testType[]>();

  useEffect(() => {
    if (data) {
      setInProgressData(data.data);
    }
  }, [data]);

  return (
    <>
      {inProgressData ? (
        <div className="bg-[rgba(14,29,60,0.20)] p-4 rounded-lg">
          <div className="flex items-center gap-2.5 p-2.5 pb-5">
            <span className="text-[#6f6f6f] text-lg font-normal">
              In Progress
            </span>
            <span className="text-[#6f6f6f] text-lg font-semibold">
              {inProgressData.length}
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            {inProgressData.map((test) => (
              <TestCard
                key={test.examId}
                test={test}
                type={testState.INPROGRESS}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>로딩 중</div>
      )}
    </>
  );
};

export default InProgressSection;
