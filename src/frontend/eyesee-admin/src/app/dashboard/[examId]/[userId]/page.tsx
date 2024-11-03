"use client";

import TestInfo from "@/components/dashBoard/TestInfo";
import CheatingVideo from "@/components/userDetail/CheatingVideo";
import TimeLine from "@/components/userDetail/TimeLine";
import { dummyTimeLineData } from "@/types/timeLine";
import React, { useState } from "react";

const UserDetailPage = () => {
  const userDetailData = dummyTimeLineData;
  const [vidieoNum, setVideoNum] = useState(0);

  return (
    <div className="flex w-screen h-screen">
      <TimeLine timeLineData={userDetailData} />
      <div className="grow bg-[#0E1D3C] text-white p-10">
        <TestInfo examName="융합캡스톤디자인 중간시험" examDuration={120} />
        <div>
          <CheatingVideo
            cheatingVideo={userDetailData.cheatingVideos[vidieoNum]}
            cheatingType={
              userDetailData.cheatingStatistics[vidieoNum].cheatingType
            }
            cheatingCounts={
              userDetailData.cheatingStatistics[vidieoNum].cheatingCount
            }
          />
          <div className="flex gap-5 py-5">
            {userDetailData.cheatingVideos.map((video, index) => (
              <div key={index} className="h-28 rounded-sm overflow-hidden">
                <img
                  className="object-contain w-full h-full"
                  src="https://images.pexels.com/photos/3808060/pexels-photo-3808060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
