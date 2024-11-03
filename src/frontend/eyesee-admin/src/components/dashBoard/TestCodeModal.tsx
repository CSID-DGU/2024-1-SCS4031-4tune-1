import PeopleIcon from "@/assets/icons/PeopleIcon.svg";
import CloseIcon from "@/assets/icons/CloseIcon.svg";
import { Dispatch, SetStateAction } from "react";

type TestCodeModalProps = {
  setCodeModalOpen: Dispatch<SetStateAction<boolean>>;
  code: string;
};

const TestCodeModal = ({ setCodeModalOpen, code }: TestCodeModalProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("시험 코드가 복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  return (
    <div className="w-screen h-screen fixed bg-[rgba(25,26,30,0.6)] z-50 flex justify-center items-center">
      <div className="relative w-[420px] flex flex-col gap-4 pt-24 pb-12 bg-[#0E1D3C]">
        <div className="absolute top-5 left-0 text-white flex justify-between w-full px-5">
          <div className="flex items-center gap-4 text-lg">
            <PeopleIcon />
            시험 초대하기
          </div>
          <CloseIcon onClick={() => setCodeModalOpen(false)} />
        </div>
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="text-2xl text-white">시험코드</div>
          <div className="flex gap-4">
            <div className="text-2xl bg-white rounded-sm px-4">{code}</div>
            <button
              onClick={handleCopy}
              className="text-[20px] px-4 bg-[#16A34A] text-white rounded-sm"
            >
              복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCodeModal;
