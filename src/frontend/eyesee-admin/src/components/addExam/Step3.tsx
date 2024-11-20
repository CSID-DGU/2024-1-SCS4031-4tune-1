import { ExamRequest } from "@/types/exam";
import { Dispatch, SetStateAction } from "react";

type Step3Props = {
  examData: ExamRequest;
  setExamData: Dispatch<SetStateAction<ExamRequest>>;
};

const Step3 = ({ examData, setExamData }: Step3Props) => {
  return (
    <div>
      {/* 유의사항 */}
      <div>
        <label className="text-black text-[24px] mb-3 block">유의사항</label>
        <textarea
          rows={10}
          value={examData.examNotice}
          onChange={(e) =>
            setExamData({ ...examData, examNotice: e.target.value })
          }
          placeholder="유의사항을 자유롭게 입력해주세요"
          className="w-full pb-20 bg-[#f3f3f3] rounded-md border border-[#A0A0A0] py-5 px-8 text-black text-[20px] resize-none"
        />
      </div>
    </div>
  );
};

export default Step3;
