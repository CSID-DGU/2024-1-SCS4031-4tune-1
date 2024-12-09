"use client";

import { testSesstion } from "@/types/user";
import React from "react";
import UserCard from "./UserCard";
import { useRouter } from "next/navigation";

type UserSectionProps = {
  sessionData: testSesstion;
};

const UserSection = ({ sessionData }: UserSectionProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/mypage`);
  };

  return (
    <div className="w-[342px] py-8 px-2.5">
      <div className="text-[#999] text-[20px] font-bold mb-12">
        <span onClick={handleClick} className="pl-3 pr-5 cursor-pointer">
          〈
        </span>
        {sessionData.examName}
      </div>
      <div className="px-5">
        <div className="pb-2">
          전체 응시자 ({sessionData.examStudentNumber})
        </div>
        <div className="bg-[rgba(9,38,102,0.10)] w-fit rounded-xl h-[80vh] overflow-scroll">
          {sessionData.user.map((user) => (
            <UserCard key={user.userId} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSection;
