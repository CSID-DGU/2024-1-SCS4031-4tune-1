"use client";

import { testType } from "@/types/test";
import TestCard from "./TestCard";
import { testState } from "@/constant/test";
import { useBeforeExam } from "@/hooks/api/useExamList";
import { useEffect, useState } from "react";

const BeforeSection = () => {
  const { data } = useBeforeExam();
  const [beforeTestData, setBeforeTestData] = useState<testType[]>();

  useEffect(() => {
    if (data) {
      setBeforeTestData(data.data);
    }
  }, [data]);

  return (
    <>
      {beforeTestData ? (
        <div className="bg-[rgba(14,29,60,0.20)] p-4 rounded-lg">
          <div className="flex items-center gap-2.5 p-2.5 pb-5">
            <span className="text-[#6f6f6f] text-lg font-normal">Before</span>
            <span className="text-[#6f6f6f] text-lg font-semibold">
              {beforeTestData.length}
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            {beforeTestData.length > 0 &&
              beforeTestData.map((test) => (
                <TestCard
                  key={test.examId}
                  test={test}
                  type={testState.BEFORE}
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

export default BeforeSection;
