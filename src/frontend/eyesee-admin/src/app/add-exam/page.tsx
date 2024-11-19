"use client";

import AddExamHeader from "@/components/add-exam/AddExamHeader";
import Step1 from "@/components/add-exam/Step1";
import Step2 from "@/components/add-exam/Step2";
import SubHeader from "@/components/add-exam/SubHeader";
import NextButton from "@/components/common/NextButton";
import { ExamRequest, initialExamData } from "@/types/postExam";
import { useState } from "react";

const AddExamPage = () => {
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState<ExamRequest>(initialExamData);

  const handleSubmit = () => {
    setStep(step + 1);
    console.log(
      examData.examDate,
      examData.examDuration,
      examData.examStartTime
    );
  };

  return (
    <div className="px-20">
      <AddExamHeader step={step} />
      <SubHeader title="강의 정보를 입력해주세요" />
      {/* 입력 필드 */}
      <div className="mt-20 flex flex-col items-center w-screen">
        <div className="w-[1000px]">
          {step === 1 && (
            <Step1 examData={examData} setExamData={setExamData} />
          )}
          {step === 2 && (
            <Step2 examData={examData} setExamData={setExamData} />
          )}
          {step === 3 && (
            <Step1 examData={examData} setExamData={setExamData} />
          )}
          {step === 4 && (
            <Step1 examData={examData} setExamData={setExamData} />
          )}
        </div>
      </div>
      <NextButton title="NEXT" onClick={handleSubmit} />
    </div>
  );
};

export default AddExamPage;
