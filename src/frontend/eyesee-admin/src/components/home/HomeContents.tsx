"use client";

import { useRouter } from "next/navigation";
import Description from "@/assets/images/Description.svg";

const HomeContents = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="relative px-14 pb-14 flex flex-col items-start gap-40">
      <Description />
      <div className="flex justify-center items-center gap-20">
        <button
          onClick={() => handleNavigation("/addExam")}
          className="flex justify-center items-center w-[18rem] h-20 rounded-lg bg-[rgb(237,237,237,0.8)] text-2xl text-[#0E1D3C]"
        >
          시험 등록하기
        </button>
        <button
          onClick={() => handleNavigation("/mypage")}
          className="flex justify-center items-center w-[18rem] h-20 rounded-lg bg-[rgb(237,237,237,0.8)] text-2xl text-[#0E1D3C]"
        >
          나의 시험 조회
        </button>
      </div>
    </div>
  );
};

export default HomeContents;
