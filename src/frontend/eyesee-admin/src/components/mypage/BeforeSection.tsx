import { beforeTestData } from "@/types/test";
import TestCard from "./TestCard";
import { testState } from "@/constant/test";

const BeforeSection = () => {
  return (
    <div className="bg-[rgba(14,29,60,0.20)] p-4 rounded-lg">
      <div className="flex items-center gap-2.5 p-2.5 pb-5">
        <span className="text-[#6f6f6f] text-lg font-normal">Before</span>
        <span className="text-[#6f6f6f] text-lg font-semibold">
          {beforeTestData.length}
        </span>
      </div>
      <div className="flex flex-col items-center gap-4">
        {beforeTestData.map((test) => (
          <TestCard test={test} type={testState.BEFORE} />
        ))}
      </div>
    </div>
  );
};

export default BeforeSection;
