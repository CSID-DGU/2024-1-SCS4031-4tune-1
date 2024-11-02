import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import BeforeSection from "@/components/mypage/BeforeSection";
import DoneSection from "@/components/mypage/DoneSection";
import InProgressSection from "@/components/mypage/InProgressSection";
import React from "react";

const MyPage = () => {
  return (
    <div>
      <Navbar bgColr="bg-[#0E1D3C]" />
      <Header title="나의 시험 조회" />
      <section className="flex gap-6">
        <BeforeSection />
        <InProgressSection />
        <DoneSection />
      </section>
    </div>
  );
};

export default MyPage;
