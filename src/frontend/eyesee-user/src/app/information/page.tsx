"use client";

import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import InformationSection from "@/components/information/InformationSection";
import { Information } from "@/types/information";
import { informationValidation } from "@/utils/validation";
import { useEffect, useState } from "react";

const InformationPage = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [information, setInformation] = useState<Information>({
    name: "",
    major: "",
    studentNumber: "",
    seatNumber: 0,
  });

  useEffect(() => {
    if (informationValidation(information)) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  }, [information]);

  return (
    <div>
      <SubHeader title="수험 정보 입력" />
      <InformationSection
        information={information}
        setInformation={setInformation}
      />
      <div className="fixed bottom-6 right-0">
        <NextButton action="/camera" title="NEXT" isAvailable={isAvailable} />
      </div>
    </div>
  );
};

export default InformationPage;
