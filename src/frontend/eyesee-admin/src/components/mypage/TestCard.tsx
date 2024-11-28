"use client";

import { testState } from "@/constant/test";
import { testType } from "@/types/test";
import React from "react";
import EditIcon from "@/assets/icons/EditIcon.svg";
import BoardIcon from "@/assets/icons/BoardIcon.svg";
import ReportIcon from "@/assets/icons/ReportIcon.svg";
import { useRouter } from "next/navigation";

type TestCardProps = {
  test: testType;
  type: string; // before, in progress, done
};

const TestCard = ({ test, type }: TestCardProps) => {
  const router = useRouter();

  // 아이콘과 경로 값을 반환하는 함수
  const buttonComponent = (type: string) => {
    if (type === testState.DONE) {
      return (
        <button
          onClick={() => router.push(`/report/${test.examId}`)}
          className="flex items-center gap-2"
        >
          <ReportIcon />
        </button>
      );
    } else {
      return (
        <div className="flex gap-[6px]">
          <button
            onClick={() => router.push(`/edit-exam/${test.examId}`)}
            className="flex items-center gap-2"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => router.push(`/dashboard/${test.examId}`)}
            className="flex items-center gap-2"
          >
            <BoardIcon />
          </button>
        </div>
      );
    }
  };

  return (
    <div
      className={`${
        type === testState.BEFORE
          ? "bg-blueGradient"
          : type === testState.INPROGRESS
          ? "bg-redGradient"
          : "bg-grayGradient"
      } px-8 py-4 rounded-[20px] w-[320px]`}
    >
      <div className="flex flex-col py-5 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-white">{test.examName}</h1>
          {buttonComponent(type)}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">시험 코드 :</span>
          <button className="bg-opaqueWhite rounded-md px-2 py-1 tracking-[0.2rem] text-[#000] text-lg font-semibold">
            {test.examRandomCode}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#b4b4b4] text-sm">{test.examSemester} 학기</span>
        <span className="text-[#b4b4b4] text-sm">{test.examDate}</span>
      </div>
    </div>
  );
};

export default TestCard;
