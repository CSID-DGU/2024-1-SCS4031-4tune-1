import CircleIcon from "@/assets/icons/Circle.svg";
import { timeLineType } from "@/types/timeLine";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type TimeLineProps = {
  timeLineData: timeLineType;
  setVideoNum: Dispatch<SetStateAction<number>>;
};

const TimeLine = ({ timeLineData, setVideoNum }: TimeLineProps) => {
  const router = useRouter();
  const { examId } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/${examId}`);
  };

  return (
    <div className="py-8 px-2.5 w-[342px] h-screen overflow-scroll bg-white">
      <div className="text-[#0E1D3C] text-[20px] font-bold mb-12">
        <span onClick={handleClick} className="pl-3 pr-5 cursor-pointer">
          〈
        </span>
        {timeLineData.userName}님 Time Line
      </div>
      <div className="flex flex-col gap-16 border-l-2 border-l-[#0E1D3C] min-h-[80vh] ml-12">
        {timeLineData.cheatingStatistics.map((cheating, index) => (
          <div
            key={index}
            onClick={() => setVideoNum(index)}
            className="relative flex items-center gap-10 cursor-pointer"
            style={{ left: -9 }}
          >
            <CircleIcon />
            <div className="text-xl text-[#000]">
              <div>{cheating.detectedTime.slice(0, 8)}</div>
              <div>{cheating.koreanTypeName} 감지</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
