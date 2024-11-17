"use client";

import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import InputTestCode from "@/components/enterTestCode/InputTestCode";
import React, { useEffect, useState } from "react";

const enterPage = () => {
  const [code, setCode] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (code != "") {
      setIsAvailable(true);
    }
  }, [code]);

  return (
    <div className="bg-white w-screen">
      <SubHeader title="시험 시작하기" />
      <div className="mt-[22vh]">
        <InputTestCode setCode={setCode} code={code} />
      </div>
      <div className="fixed bottom-6 right-0">
        <NextButton
          action="/agreement"
          title="NEXT"
          isAvailable={isAvailable}
        />
      </div>
    </div>
  );
};

export default enterPage;
