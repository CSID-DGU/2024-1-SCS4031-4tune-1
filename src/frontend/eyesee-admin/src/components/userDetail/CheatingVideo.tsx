import React from "react";
import { cheatingVideo } from "@/types/timeLine";

type CheatingVideoProps = {
  cheatingVideo: cheatingVideo;
  cheatingType: string;
  cheatingCounts: number;
};

const CheatingVideo = ({
  cheatingVideo,
  cheatingType,
  cheatingCounts,
}: CheatingVideoProps) => {
  return (
    <div className="text-white">
      <div className="bg-[rgba(58,64,97,0.7)] text-xl px-6 py-4 rounded-t-lg flex justify-between items-center">
        ⏳ {cheatingVideo.startTime} ~ {cheatingVideo.endTime}
        <button className="bg-[#EF4444] px-3 py-2 flex justify-center items-center rounded-lg text-base">
          {cheatingType} {cheatingCounts}회
        </button>
      </div>
      <video
        src={cheatingVideo.filepath}
        controls
        className="w-full h-auto rounded-b-lg"
      ></video>
    </div>
  );
};

export default CheatingVideo;
