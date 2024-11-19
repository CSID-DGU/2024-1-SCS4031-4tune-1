import CheckIcon from "@/assets/icons/CheckIcon.svg";
import SmallCheckIcon from "@/assets/icons/SmallCheckIcon.svg";

type Step4Props = {
  code: string;
};

const Step4 = ({ code }: Step4Props) => {
  // 복사 버튼 클릭 핸들러
  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(code) // 클립보드에 코드 복사
      .then(() => {
        alert("시험 코드가 복사되었습니다!"); // 성공 알림
      })
      .catch((err) => {
        console.error("코드 복사 실패:", err); // 에러 처리
        alert("코드 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-40 mt-[10vh]">
      {/* 완료 메시지 */}
      <div className="flex flex-col justify-center items-center gap-7">
        <CheckIcon />
        <div className="text-black text-[40px] font-semibold tracking-[4px]">
          사전 정보 등록이 완료되었습니다!
        </div>
      </div>

      {/* 시험 코드 표시 및 복사 */}
      <div className="w-fit flex items-center rounded-lg py-6 px-7 gap-20 bg-[rgba(14,29,60,0.10)]">
        <div className="flex items-center gap-2">
          <SmallCheckIcon />
          <div className="text-[#0E1D3C] text-[30px]">시험 코드</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-[60px] px-10 bg-white flex justify-center items-center rounded-md text-black text-[30px] font-bold tracking-[6px]">
            {code}
          </div>
          <button
            onClick={handleCopyCode}
            className="h-[60px] bg-[#16A34A] flex justify-center items-center rounded-md px-7 text-white text-[24px] hover:bg-[#13823e] transition"
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
