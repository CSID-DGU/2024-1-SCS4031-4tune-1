"use client";

import { user } from "@/types/user";
import OpenIcon from "@/assets/icons/OpenIcon.svg";
import CaoutionIcon from "@/assets/icons/CautionIcon.svg";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomSheet from "./BottomSheet";

type DashBoardCardProps = {
  user: user;
  exam: {
    name: string;
    duration: number;
  };
};

const DashBoardCard = ({ user, exam }: DashBoardCardProps) => {
  const router = useRouter();
  const { examId } = useParams();

  // 부정행위 탐지시 바텀시트(클릭시 닫힘)
  const [bottomSheet, setBottomSheet] = useState(false);

  const handleClick = () => {
    router.push(`/dashboard/${examId}/${user.userId}`);
  };

  const handleBottomSheetClick = () => {
    setBottomSheet(false);
  };

  useEffect(() => {
    if (user.cheatingCount > 0) {
      setBottomSheet(true);
    }
  }, [user.cheatingCount]);

  return (
    <div className="relative">
      {bottomSheet && <BottomSheet onClick={handleBottomSheetClick} />}
      <div
        onClick={handleClick}
        className={`relative w-[180px] h-[135px] rounded-md flex flex-col justify-center items-center cursor-pointer ${
          bottomSheet && user.cheatingCount === 1
            ? "bg-[#EAB308]" // 부정행위 1회 감지
            : bottomSheet && user.cheatingCount > 1
            ? "bg-[#EF4444]" // 부정행위 2회 이상 감지
            : // 수험자 부정행위를 확인한 경우 혹은 부정행위가 탐지되지 않은 경우
              "bg-[#16A34A]"
        }`}
      >
        <div className="absolute top-3 right-3">
          <OpenIcon />
        </div>
        <div className="text-white text-[30px] font-semibold">
          {user.userName}
        </div>
        <div className="text-[10px] text-white">
          학번 {user.userNum}
          {" | "} 좌석번호 {user.seatNum}
        </div>
        <div className="absolute bottom-2 text-[#2a2a2a] text-[8px] flex items-center">
          <CaoutionIcon />
          부정행위 감지 {user.cheatingCount}회
        </div>
      </div>
    </div>
  );
};

export default DashBoardCard;
