"use client";

import { testType } from "@/types/test";
import TestCard from "./TestCard";
import { testState } from "@/constant/test";
import { useDoneExam } from "@/hooks/api/useExamList";
import { useEffect, useState } from "react";

const DoneSection = () => {
  const { data } = useDoneExam();

  const [doneData, setDoneData] = useState<testType[]>();

  useEffect(() => {
    if (data) {
      const sortedData = [...data.data].sort((a, b) => {
        return new Date(b.examDate).getTime() - new Date(a.examDate).getTime();
      });
      setDoneData(sortedData);
    }
  }, [data]);

  return (
    <>
      {doneData ? (
        <div className="bg-[rgba(14,29,60,0.20)] p-4 rounded-lg w-[350px]">
          <div className="flex items-center gap-2.5 p-2.5 pb-5">
            <span className="text-[#6f6f6f] text-lg font-normal">Done</span>
            <span className="text-[#6f6f6f] text-lg font-semibold">
              {doneData.length}
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            {doneData.map((test) => (
              <TestCard key={test.examId} test={test} type={testState.DONE} />
            ))}
          </div>
        </div>
      ) : (
        <div>로딩 중</div>
      )}
    </>
  );
};

export default DoneSection;
