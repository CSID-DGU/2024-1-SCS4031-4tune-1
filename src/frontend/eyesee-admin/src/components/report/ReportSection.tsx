import ExcelIcon from "@/assets/images/Excel.svg";

const ReportSection = () => {
  return (
    <div className="relative w-full mb-20 flex justify-between gap-20">
      <div className="cursor-pointer absolute bottom-0 flex items-center gap-3">
        <ExcelIcon />
        <p className="text-[20px]">엑셀 다운로드</p>
      </div>
      <div className="w-[50%] h-full text-[2.5rem] font-bold text-white">
        <p className="">2024년 11월 27일</p>
        <p className="text-[#16A34A]">융합캡스톤디자인 중간시험</p>
        <p>부정행위 탐지 결과</p>
      </div>
      <div className="[w-50%] flex flex-col h-full">
        <div className="w-full flex gap-20 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>총 탐지된 부정행위 건수</div>
          <div>75건</div>
        </div>
        <div className="w-full flex gap-20 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>부정행위 탐지 수험자 수</div>
          <div>15명</div>
        </div>
        <div className="w-full flex gap-20 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>평균 부정행위 탐지 건수</div>
          <div>5건/수험자</div>
        </div>
        <div className="w-full flex gap-20 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>최다 부정행위 탐지 수험자</div>
          <div>학번: 2022113107, 횟수: 10건</div>
        </div>
        <div className="w-full flex gap-20 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>부정행위 탐지율</div>
          <div>30%</div>
        </div>
        <div className="w-full flex gap-20 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>부정행위 유형별 통계</div>
          <div>시선: 50건, 자리이탈: 10건</div>
        </div>
      </div>
    </div>
  );
};

export default ReportSection;
