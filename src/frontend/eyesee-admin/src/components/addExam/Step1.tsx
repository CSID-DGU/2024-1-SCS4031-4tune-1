import { ExamRequest } from "@/types/exam";
import { Dispatch, SetStateAction } from "react";
import XIcon from "@/assets/icons/XIcon.svg";

type Step1Props = {
  examData: ExamRequest;
  setExamData: Dispatch<SetStateAction<ExamRequest>>;
};

const Step1 = ({ examData, setExamData }: Step1Props) => {
  // 공통 핸들러 함수
  const handleChange = (key: keyof ExamRequest, value: string | number) => {
    setExamData({ ...examData, [key]: value });
  };

  // 공통 input 스타일 정의
  const inputClassName =
    "w-full mb-10 bg-[#f3f3f3] rounded-md border border-[#A0A0A0] py-5 px-8 text-black text-[20px]";

  return (
    <div className="mb-24">
      {/* 강의명 */}
      <div>
        <label className="text-black text-[24px] mb-3 block">강의명</label>
        <input
          type="text"
          value={examData.examName}
          onChange={(e) => handleChange("examName", e.target.value)}
          placeholder="입력해주세요"
          className={inputClassName}
        />
      </div>

      {/* 수강 학기와 수강 인원 */}
      <div className="flex justify-between gap-10">
        <div className="grow">
          <label className="text-black text-[24px] mb-3 block">수강 학기</label>
          <input
            type="text"
            value={examData.examSemester}
            onChange={(e) => handleChange("examSemester", e.target.value)}
            placeholder="입력해주세요"
            className={inputClassName}
          />
        </div>
        <div className="grow">
          <label className="text-black text-[24px] mb-3 block">수강 인원</label>
          <input
            type="number"
            value={examData.examStudentNumber || ""}
            onChange={(e) =>
              handleChange("examStudentNumber", Number(e.target.value))
            }
            placeholder="입력해주세요"
            className={inputClassName}
          />
        </div>
      </div>

      {/* 강의실 */}
      <div>
        <label className="text-black text-[24px] mb-3 block">강의실</label>
        <input
          type="text"
          value={examData.examLocation}
          onChange={(e) => handleChange("examLocation", e.target.value)}
          placeholder="입력해주세요"
          className={inputClassName}
        />
      </div>

      {/* 강의실 좌석 배치 */}
      <div>
        <label className="text-black text-[24px] mb-3 block">
          강의실 좌석 배치
        </label>
        <div className="flex gap-5 items-center justify-between">
          <input type="number" placeholder="8" className={inputClassName} />
          <XIcon className="mb-10" />
          <input type="number" placeholder="8" className={inputClassName} />
        </div>
      </div>
    </div>
  );
};

export default Step1;
