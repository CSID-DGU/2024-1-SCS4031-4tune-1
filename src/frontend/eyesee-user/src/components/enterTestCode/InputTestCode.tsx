import { Dispatch, SetStateAction } from "react";

type InputTestCodeProps = {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
};

const InputTestCode = ({ code, setCode }: InputTestCodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="text-[#0E1D3C] text-[24px]">시험 코드 입력</div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        type="text"
        className="h-[10vh] w-[50vw] border-b border-black text-center text-[30px] font-semibold focus:outline-none"
      />
    </div>
  );
};

export default InputTestCode;
