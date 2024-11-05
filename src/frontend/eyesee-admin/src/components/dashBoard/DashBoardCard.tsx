import { user } from "@/types/user";
import OpenIcon from "@/assets/icons/OpenIcon.svg";
import CaoutionIcon from "@/assets/icons/CautionIcon.svg";
import React from "react";
import { useParams, useRouter } from "next/navigation";

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

  const handleClick = () => {
    router.push(`/dashboard/${examId}/${user.userId}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-[180px] h-[115px] rounded-md flex flex-col justify-center items-center cursor-pointer ${
        user.cheatingCount === 0
          ? "bg-[#16A34A]" // 부정행위 0회 감지
          : user.cheatingCount === 1
          ? "bg-[#EAB308]" // 부정행위 1회 감지
          : "bg-[#EF4444]" // 부정행위 2회 이상 감지
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
  );
};

export default DashBoardCard;
