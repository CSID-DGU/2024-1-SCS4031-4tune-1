"use client";

import AddExamHeader from "@/components/add-exam/AddExamHeader";
import SubHeader from "@/components/add-exam/SubHeader";
import { useState } from "react";

const AddExamPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="px-20">
      <AddExamHeader step={step} />
      <SubHeader title="강의 정보를 입력해주세요" />
    </div>
  );
};

export default AddExamPage;
