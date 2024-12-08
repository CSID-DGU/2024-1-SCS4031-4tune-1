import { downloadReport } from "@/apis/report";
import ExcelIcon from "@/assets/images/Excel.svg";
import { ReportResponse } from "@/types/report";
import { useParams } from "next/navigation";

type ReportSectionType = {
  reportData: ReportResponse;
};

const ReportSection = ({ reportData }: ReportSectionType) => {
  const { examId } = useParams();

  // 시험 레포트 엑셀 다운로드
  const handleDownload = () => {
    if (examId) {
      downloadReport(Number(examId));
    } else {
      console.error("exam id가 존재하지 않습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="relative w-full mt-10 mb-20 flex justify-between gap-20">
      <div
        onClick={handleDownload}
        className="cursor-pointer absolute bottom-0 flex items-center gap-3"
      >
        <ExcelIcon />
        <p className="text-[20px]">엑셀 다운로드</p>
      </div>
      <div className="fixed bottom-5 text-2xl text-red-500 font-bold z-30 shadow-lg">
        종료된 시험입니다.
      </div>
      <div className="w-[50%] h-full text-[2.5rem] font-bold text-white">
        <p className="">2024년 11월 27일</p>
        <p className="text-[#16A34A]">{reportData.examName}</p>
        <p>부정행위 탐지 결과</p>
      </div>
      <div className="[w-50%] flex flex-col h-full">
        <div className="w-full flex gap-10 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>총 탐지된 부정행위 건수</div>
          <div>{reportData.totalCheatingCount}건</div>
        </div>
        <div className="w-full flex gap-10 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>부정행위 탐지 수험자 수</div>
          <div>{reportData.cheatingStudentsCount}명</div>
        </div>
        <div className="w-full flex gap-10 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>평균 부정행위 탐지 건수</div>
          <div>
            {Number(reportData.averageCheatingCount).toFixed(1)}건/수험자
          </div>
        </div>
        <div className="w-full flex gap-10 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>최다 부정행위 탐지 수험자</div>
          <div>{reportData.maxCheatingStudent}</div>
        </div>
        <div className="w-full flex gap-10 py-3 items-center justify-between text-[20px] text-bold border-b border-white">
          <div>부정행위 탐지율</div>
          <div>{Number(reportData.cheatingRate).toFixed(2)}%</div>
        </div>
        <div className="w-full flex gap-10 py-3 items-start justify-between text-[20px] text-bold border-b border-white">
          <div>부정행위 유형별 통계</div>
          <div className="flex flex-col gap-2">
            {Object.entries(reportData.cheatingTypeStatistics).map(
              ([type, count]) => (
                <span key={type} className="border-b border-gray-500 px-3">
                  {type}: {count}건
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSection;
