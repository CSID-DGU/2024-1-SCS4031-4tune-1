type AddExamHeaderProps = {
  step: number;
};

const AddExamHeader = ({ step }: AddExamHeaderProps) => {
  return (
    <div className="pb-[12vh] border-b-2 border-[#0E1D3C]">
      <div className="relative bg-[#999] h-[2px] w-full my-10">
        <div className="absolute bg-[#0E1D3C] rounded-full w-6 h-6 top-[-12px]" />
        <div className="absolute bg-[#0E1D3C] rounded-full w-6 h-6 top-[-12px] left-[33%]" />
        <div className="absolute bg-[#0E1D3C] rounded-full w-6 h-6 top-[-12px] left-[66%]" />
        <div className="absolute bg-[#0E1D3C] rounded-full w-6 h-6 top-[-12px] right-0" />
      </div>
      <div
        className={`absolute left-0 flex flex-col items-start justify-center ${
          step === 1 ? "text-[#0E1D3C]" : "text-[#999]"
        } text-[28px] font-bold`}
      >
        <div>STEP1.</div>
        <div>강의 정보 등록</div>
      </div>
      <div
        className={`absolute left-[33%] flex flex-col items-start ${
          step === 2 ? "text-[#0E1D3C]" : "text-[#999]"
        } text-[28px] font-bold`}
      >
        <div>STEP2.</div>
        <div>시험 정보 등록</div>
      </div>
      <div
        className={`absolute left-[66%] flex flex-col items-start ${
          step === 3 ? "text-[#0E1D3C]" : "text-[#999]"
        } text-[28px] font-bold`}
      >
        <div>STEP3.</div>
        <div>유의사항 등록</div>
      </div>
      <div
        className={`absolute right-0 flex flex-col items-end ${
          step === 4 ? "text-[#0E1D3C]" : "text-[#999]"
        } text-[28px] font-bold`}
      >
        <div>
          사전정보
          <br />
          등록 완료
        </div>
      </div>
    </div>
  );
};

export default AddExamHeader;
