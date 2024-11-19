"use client";

import AddExamHeader from "@/components/add-exam/AddExamHeader";
import Step1 from "@/components/add-exam/Step1";
import Step2 from "@/components/add-exam/Step2";
import Step3 from "@/components/add-exam/Step3";
import Step4 from "@/components/add-exam/Step4";
import SubHeader from "@/components/add-exam/SubHeader";
import NextButton from "@/components/common/NextButton";
import { useAddExam } from "@/hooks/api/useExam";
import { useTestCodeStore } from "@/store/useTestCodeStore";
import { ExamRequest, initialExamData } from "@/types/exam";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddExamPage = () => {
  const router = useRouter();
  const { examRandomCode } = useTestCodeStore();
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState<ExamRequest>(initialExamData);

  const { mutate } = useAddExam();

  const handleSubmit = () => {
    if (step === 3) {
      mutate(examData);
      setStep(step + 1);
    } else if (step === 4) {
      router.push("/");
    } else setStep(step + 1);
    console.log(
      examData.examDate,
      examData.examDuration,
      examData.examStartTime
    );
  };

  return (
    <div className="px-20">
      <AddExamHeader step={step} />
      {step !== 4 && (
        <SubHeader
          title={
            step === 1
              ? "강의 정보를 입력해주세요"
              : step === 2
              ? "시험 정보를 입력해주세요"
              : "수험자에게 전달할 유의사항을 입력해주세요"
          }
        />
      )}
      {/* 입력 필드 */}
      <div className="mt-20 flex flex-col items-center w-full">
        <div className="w-[1000px]">
          {step === 1 && (
            <Step1 examData={examData} setExamData={setExamData} />
          )}
          {step === 2 && (
            <Step2 examData={examData} setExamData={setExamData} />
          )}
          {step === 3 && (
            <Step3 examData={examData} setExamData={setExamData} />
          )}
          {step === 4 && <Step4 code={examRandomCode} />}
        </div>
      </div>
      <NextButton title={step !== 4 ? "NEXT" : "HOME"} onClick={handleSubmit} />
    </div>
  );
};

export default AddExamPage;
