import React from "react";
import CameraIcon from "@/assets/icons/CameraIcon.svg";
import SeatIcon from "@/assets/icons/SeatIcon.svg";
import MoreIcon from "@/assets/icons/MoreIcon.svg";
import { user } from "@/types/user";

type UserCardProps = {
  user: user;
};

const UserCard = ({ user }: UserCardProps) => {
  const isCameraOn = true; // 추후 로직 추가 예정
  const isSeatOn = true; // 추후 로직 추가 예정

  return (
    <div className="w-[282px] p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span className="text-[#000] text-[20px] font-semibold">
            {user.userName}
          </span>
          <button className="bg-[#0E1D3C] rounded px-2 py-[2px] text-white">
            감독 on
          </button>
        </div>
        <div className="flex items-center gap-1">
          <CameraIcon fill={`${isCameraOn ? "#0FA958" : "#7C7C7B"}`} />
          <SeatIcon fill={`${isSeatOn ? "#0FA958" : "#7C7C7B"}`} />
          <MoreIcon />
        </div>
      </div>
      <div className="text-[#6F6F6F] font-medium text-[14px] flex items-center gap-4">
        <span className="w-[120px]">학번 {user.userNum}</span>
        <span>좌석번호 {user.seatNum}</span>
      </div>
    </div>
  );
};

export default UserCard;
