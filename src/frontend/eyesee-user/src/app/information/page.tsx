"use client";

import { userInformation } from "@/apis/userInformation";
import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import InformationSection from "@/components/information/InformationSection";
import { useExamStore } from "@/store/useExamStore";
import { useUserStore } from "@/store/useUserStore";
import { UserInfoRequest } from "@/types/exam";
import { setAccessToken, setRefreshToken } from "@/utils/auth";
import { informationValidation } from "@/utils/validation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InformationPage = () => {
  const router = useRouter();

  const { setUserId } = useUserStore();
  const { setExamId } = useUserStore();
  const { exam } = useExamStore();

  const [isAvailable, setIsAvailable] = useState(false);
  const [information, setInformation] = useState<UserInfoRequest>({
    // TODO: 서버 데이터 타입 통일 필요
    examCode: exam.examRandomCode,
    name: "",
    department: "",
    userNum: 0,
    seatNum: 0,
  });

  // 수험자 정보 제출 핸들러
  const handleSubmit = async () => {
    try {
      const response = await userInformation(information); // API 호출
      console.log("응답 데이터:", response); // 성공 시 데이터 처리
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
      setUserId(response.data.userId);
      setExamId(response.data.examId);
      console.log(response.data.userId, response.data.examId);

      router.push("/camera");
    } catch (error) {
      console.error("수험 정보 입력 실패:", error); // 실패 시 에러 처리
      alert("수험 정보 입력에 실패했습니다. 다시 시도해주세요.");
    }
  };

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
        <NextButton
          onSubmit={handleSubmit}
          title="NEXT"
          isAvailable={isAvailable}
        />
      </div>
    </div>
  );
};

export default InformationPage;
