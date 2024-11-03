"use client";

import { testState } from "@/constant/test";
import { testType } from "@/types/test";
import React from "react";
import EditIcon from "@/assets/icons/EditIcon.svg";
import BoardIcon from "@/assets/icons/BoardIcon.svg";
import { useRouter } from "next/navigation";

type TestCardProps = {
  test: testType;
  type: string; // before, in progress, done
};

const TestCard = ({ test, type }: TestCardProps) => {
  const router = useRouter();

  // 아이콘과 경로 값을 반환하는 함수
  const testMap = (type: string) => {
    if (type === testState.BEFORE) {
      return {
        icon: <EditIcon />,
        path: "/editExam",
        label: "Edit",
      };
    } else {
      return {
        icon: <BoardIcon />,
        path: "/dashboard",
        label: "Dashboard",
      };
    }
  };

  // testMap 함수 호출 결과를 저장
  const { icon, path } = testMap(type);

  return (
    <div
      className={`${
        type === testState.BEFORE ? "bg-blueGradient" : "bg-redGradient"
      } px-8 py-4 rounded-[20px] w-[320px]`}
    >
      <div className="flex flex-col py-5 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-white">{test.examName}</h1>
          <button
            onClick={() => router.push(path)}
            className="flex items-center gap-2"
          >
            {icon}
          </button>
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
