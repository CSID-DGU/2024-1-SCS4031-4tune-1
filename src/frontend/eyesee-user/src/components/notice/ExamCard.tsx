"use client";

import { useExamStore } from "@/store/useExamStore";

const ExamCard = () => {
  const { exam } = useExamStore();

  return (
    <div className="mt-8 py-[26px] px-[20px] bg-[#0E1D3C] shadow-lg flex flex-col rounded-ss-2xl rounded-ee-2xl">
      <div className="text-white flex items-center py-3 border-b border-white px-3">
        <div className="text-[14px] w-[25vw]">강의명</div>
        <div className="text-[12px] font-semibold">{exam.examName}</div>
      </div>
      <div className="text-white flex items-center py-3 border-b border-white px-3">
        <div className="text-[14px] w-[25vw]">담당 교수</div>
        <div className="text-[12px] font-semibold">확인중</div>
      </div>
      <div className="text-white flex items-center py-3 border-b border-white px-3">
        <div className="text-[14px] w-[25vw]">시험 시작시간</div>
        <div className="text-[12px] font-semibold">{exam.examStartTime}</div>
      </div>
      <div className="text-white flex items-center py-3 border-b border-white px-3">
        <div className="text-[14px] w-[25vw]">진행 시간</div>
        <div className="text-[12px] font-semibold">{exam.examDuration}분</div>
      </div>
      <div className="text-white flex items-center py-3 border-b border-white px-3">
        <div className="text-[14px] w-[25vw]">문제 수</div>
        <div className="text-[12px] font-semibold">확인 중</div>
      </div>
      <div className="text-white flex items-center py-3 border-b border-white px-3">
        <div className="text-[14px] w-[25vw]">총 점수</div>
        <div className="text-[12px] font-semibold">확인 중</div>
      </div>
      <div className="text-white text-[10px] mt-3">
        ※ 카메라 권한을 허용해야 합니다.
      </div>
    </div>
  );
};

export default ExamCard;
