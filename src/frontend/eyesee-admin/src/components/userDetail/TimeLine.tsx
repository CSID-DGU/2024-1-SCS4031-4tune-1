import CircleIcon from "@/assets/icons/Circle.svg";
import { timeLineType } from "@/types/timeLine";
import { useParams, useRouter } from "next/navigation";

type TimeLineProps = {
  timeLineData: timeLineType;
};

const TimeLine = ({ timeLineData }: TimeLineProps) => {
  const router = useRouter();
  const { examId } = useParams();

  const handleClick = () => {
    router.push(`/dashboard/${examId}`);
  };

  return (
    <div className="py-8 px-2.5 w-[342px]">
      <div className="text-[#0E1D3C] text-[20px] font-bold mb-12">
        <span onClick={handleClick} className="pl-3 pr-5">
          〈
        </span>
        {timeLineData.userName}님 Time Line
      </div>
      <div className="relative border-l-2 border-l-[#0E1D3C] h-[80vh] ml-12">
        {timeLineData.cheatingStatistics.map((cheating, index) => (
          <div
            key={cheating.cheatingStatisticsId}
            className="absolute left-0 flex items-center gap-10"
            style={{ left: -9, top: `${index * 30}%` }}
          >
            <CircleIcon />
            <div className="text-xl text-[#000]">
              <div>{cheating.DetectedTime.slice(-8)}</div>
              <div>
                {cheating.cheatingType} {cheating.cheatingCount}회 감지
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
