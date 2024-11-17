"use client";

import AgreementSection from "@/components/agreement/AgreementSection";
import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import { Agreements } from "@/types/agreements";
import { useEffect, useState } from "react";

const AgreementPage = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [agreements, setAgreements] = useState<Agreements>({
    all: false,
    personalInfo: false,
    thirdParty: false,
  });

  useEffect(() => {
    if (agreements.personalInfo) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  }, [agreements.personalInfo]);

  return (
    <div>
      <SubHeader title="시험 시작하기" />
      <AgreementSection agreements={agreements} setAgreements={setAgreements} />
      <div className="fixed bottom-6 right-0">
        <NextButton
          action="/information"
          title="NEXT"
          isAvailable={isAvailable}
        />
      </div>
    </div>
  );
};

export default AgreementPage;
