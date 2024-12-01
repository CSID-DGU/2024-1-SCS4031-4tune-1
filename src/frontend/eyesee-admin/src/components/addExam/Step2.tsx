import { ExamRequest } from "@/types/exam";
import CTAIcon from "@/assets/icons/CTAIcon.svg";
import { Dispatch, SetStateAction, useState } from "react";
import CheatingSetting from "./CheatingSetting";
import { MonitoringCondition } from "@/constant/monitoring";

type Step2Props = {
  examData: ExamRequest;
  setExamData: Dispatch<SetStateAction<ExamRequest>>;
  handleToggleCondition: (condition: MonitoringCondition) => void;
};

const Step2 = ({
  examData,
  setExamData,
  handleToggleCondition,
}: Step2Props) => {
  const [cheatingModal, setCheatingModal] = useState(false);

  // 시험 일시 상태
  const [date, setDate] = useState({ year: "", month: "", day: "" });
  const handleDate = (key: keyof typeof date, value: string) => {
    const updatedDate = { ...date, [key]: value };
    setDate(updatedDate);
    // YYYY-MM-DD 형식으로 변환
    const formattedDate = `${updatedDate.year}-${updatedDate.month}-${updatedDate.day}`;
    setExamData({ ...examData, examDate: formattedDate });
  };

  // 시험 시작 시각 상태
  const [startTime, setStartTime] = useState({ hour: "", minute: "" });
  const handleStartTime = (key: keyof typeof startTime, value: string) => {
    const updatedTime = { ...startTime, [key]: value };
    setStartTime(updatedTime);
    // HH:mm 형식으로 변환
    const formattedStartTime = `${updatedTime.hour}:${updatedTime.minute}`;
    setExamData({ ...examData, examStartTime: formattedStartTime });
  };

  // 공통 핸들러 함수
  const handleChange = (key: keyof ExamRequest, value: number) => {
    setExamData({ ...examData, [key]: value });
  };

  // 공통 input 스타일 정의
  const inputClassName =
    "relative w-full mb-10 bg-[#f3f3f3] rounded-md border border-[#A0A0A0] py-5 px-8 text-black text-[20px]";

  return (
    <>
      {cheatingModal && (
        <CheatingSetting
          examData={examData}
          handleToggleCondition={handleToggleCondition}
          setCheatingModal={setCheatingModal}
        />
      )}
      <div>
        {/* 시험 일시 */}
        <div className="flex justify-between gap-10">
          <div className="grow">
            <label className="text-black text-[24px] mb-3 block">
              시험 일시
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={date.year}
                onChange={(e) => handleDate("year", e.target.value)}
                placeholder="YYYY"
                className={inputClassName}
              />
              <input
                type="text"
                value={date.month}
                onChange={(e) => handleDate("month", e.target.value)}
                placeholder="MM"
                className={inputClassName}
              />
              <input
                type="text"
                value={date.day}
                onChange={(e) => handleDate("day", e.target.value)}
                placeholder="DD"
                className={inputClassName}
              />
            </div>
          </div>
        </div>

        {/* 시험 시작 시각 및 진행 시간 */}
        <div className="flex justify-between gap-20">
          <div className="grow">
            <label className="text-black text-[24px] mb-3 block">
              시험 시작 시각
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={startTime.hour}
                onChange={(e) => handleStartTime("hour", e.target.value)}
                placeholder="Hour"
                className={inputClassName}
              />
              <span className="mb-10 text-[40px] self-center">:</span>
              <input
                type="text"
                value={startTime.minute}
                onChange={(e) => handleStartTime("minute", e.target.value)}
                placeholder="Minute"
                className={inputClassName}
              />
            </div>
          </div>
          <div className="grow relative">
            <label className="text-black text-[24px] mb-3 block">
              진행 시간
            </label>
            <input
              type="number"
              value={examData.examDuration || ""}
              onChange={(e) =>
                handleChange("examDuration", Number(e.target.value))
              }
              placeholder="120"
              className={inputClassName}
            />
            <span className="text-black text-[20px] absolute right-8 top-[68px]">
              분
            </span>
          </div>
        </div>

        {/* 문제 수 및 총 점수 */}
        <div className="flex justify-between gap-20">
          <div className="grow relative">
            <label className="text-black text-[24px] mb-3 block">문제 수</label>
            <input
              type="number"
              value={examData.examQuestionNumber || ""}
              onChange={(e) =>
                handleChange("examQuestionNumber", Number(e.target.value))
              }
              placeholder="50"
              className={inputClassName}
            />
            <span className="text-black text-[20px] absolute right-8 top-[68px]">
              개
            </span>
          </div>
          <div className="grow relative">
            <label className="text-black text-[24px] mb-3 block">총 점수</label>
            <input
              type="number"
              value={examData.examTotalScore || ""}
              onChange={(e) =>
                handleChange("examTotalScore", Number(e.target.value))
              }
              placeholder="100"
              className={inputClassName}
            />
            <span className="text-black text-[20px] absolute right-8 top-[68px]">
              점
            </span>
          </div>
        </div>

        {/* 부정행위 탐지 */}
        <div className="flex items-center gap-4 text-black text-[24px] mb-3">
          부정행위 탐지 기준 설정하기
          <CTAIcon onClick={() => setCheatingModal(true)} />
        </div>
      </div>
    </>
  );
};

export default Step2;
