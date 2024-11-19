"use client";

import AddExamHeader from "@/components/add-exam/AddExamHeader";
import Step1 from "@/components/add-exam/Step1";
import SubHeader from "@/components/add-exam/SubHeader";
import { ExamRequest, initialExamData } from "@/types/postExam";
import { useState } from "react";

const AddExamPage = () => {
  const [step, setStep] = useState(1);
  const [examData, setExamData] = useState<ExamRequest>(initialExamData);

  return (
    <div className="px-20">
      <AddExamHeader step={step} />
      <SubHeader title="강의 정보를 입력해주세요" />
      <Step1 examData={examData} setExamData={setExamData} />
    </div>
  );
};

export default AddExamPage;
