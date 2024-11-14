import Link from "next/link";

const HomeCta = () => {
  return (
    <div className="mx-[8vw] flex flex-col items-center gap-4">
      <Link
        href={"/enter"}
        className="w-full py-4 rounded-[10px] bg-[rgba(237,237,237,0.8)] text-[#0e1d3c] text-[18px]]"
      >
        <button className="w-full">시험장 접속</button>
      </Link>
      <button className="bg-none border-b border-white text-[#d9d9d9] text-[10px]">
        이용에 불편함이 있으신가요?
      </button>
    </div>
  );
};

export default HomeCta;
