import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import BeforeSection from "@/components/mypage/BeforeSection";
import DoneSection from "@/components/mypage/DoneSection";
import InProgressSection from "@/components/mypage/InProgressSection";
import React from "react";

const MyPage = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center">
      <Navbar bgColr="bg-[#0E1D3C]" />
      <div className="w-[1100px] flex flex-col justify-center pt-20 pb-14">
        <Header title="나의 시험 조회" />
        <section className="flex gap-6 w-full justify-between mt-10">
          <BeforeSection />
          <InProgressSection />
          <DoneSection />
        </section>
      </div>
    </div>
  );
};

export default MyPage;
