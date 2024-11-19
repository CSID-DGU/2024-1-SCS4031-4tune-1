type AddExamHeaderProps = {
  step: number;
};

const AddExamHeader = ({ step }: AddExamHeaderProps) => {
  return (
    <div className="pb-[100px] border-b-[3px] border-[#0E1D3C]">
      <div className="relative bg-[#999] h-[2px] w-full my-10">
        {/* 스탬프 영역 */}
        <div
          className={`absolute bg-[#0E1D3C] rounded-full w-6 h-6 top-[-12px]`}
        />
        <div
          className={`absolute ${
            step === 1 ? "bg-[#999]" : "bg-[#0E1D3C]"
          } rounded-full w-6 h-6 top-[-12px] left-[33%]`}
        />
        <div
          className={`absolute ${
            step <= 2 ? "bg-[#999]" : "bg-[#0E1D3C]"
          } rounded-full w-6 h-6 top-[-12px] left-[66%]`}
        />
        <div
          className={`absolute  ${
            step !== 4 ? "bg-[#999]" : "bg-[#0E1D3C]"
          } rounded-full w-6 h-6 top-[-12px] right-0`}
        />
        {/* 글자 영역 */}
        <div
          className={`absolute top-[30px] flex flex-col items-start justify-center ${
            step === 1 ? "text-[#0E1D3C]" : "text-[#999]"
          } text-[28px] font-bold`}
        >
          <div>STEP1.</div>
          <div>강의 정보 등록</div>
        </div>
        <div
          className={`absolute top-[30px] left-[33%] flex flex-col items-start ${
            step === 2 ? "text-[#0E1D3C]" : "text-[#999]"
          } text-[28px] font-bold`}
        >
          <div>STEP2.</div>
          <div>시험 정보 등록</div>
        </div>
        <div
          className={`absolute top-[30px] left-[66%] flex flex-col items-start ${
            step === 3 ? "text-[#0E1D3C]" : "text-[#999]"
          } text-[28px] font-bold`}
        >
          <div>STEP3.</div>
          <div>유의사항 등록</div>
        </div>
        <div
          className={`absolute top-[30px] right-0 flex flex-col ${
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
    </div>
  );
};

export default AddExamHeader;
