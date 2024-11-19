"use client";

import { enterSession } from "@/apis/examCode";
import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import InputTestCode from "@/components/enterTestCode/InputTestCode";
import { useExamStore } from "@/store/useExamStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EnterPage = () => {
  const [code, setCode] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const { setExam } = useExamStore();
  const router = useRouter();

  // 시험 코드 제출 핸들러
  const handleSubmit = async () => {
    try {
      const response = await enterSession({ examCode: code }); // API 호출
      console.log("응답 데이터:", response); // 성공 시 데이터 처리
      setExam(response.data);
      router.push("/notice");
    } catch (error) {
      console.error("시험 세션 참여 실패:", error); // 실패 시 에러 처리
      alert("시험 코드 확인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (code.trim() != "") {
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
          title="NEXT"
          isAvailable={isAvailable}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EnterPage;
