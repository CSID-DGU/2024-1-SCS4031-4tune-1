"use client";

import AddExamHeader from "@/components/add-exam/AddExamHeader";
import { useState } from "react";

const AddExamPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div>
      <AddExamHeader step={step} />
    </div>
  );
};

export default AddExamPage;
