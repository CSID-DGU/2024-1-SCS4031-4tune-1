export type cheatingStatistics = {
  cheatingStatisticsId: number;
  cheatingType: string;
  cheatingCount: number;
  DetectedTime: string;
};

export type cheatingVideo = {
  videoId: number;
  startTime: string;
  endTime: string;
  filepath: string;
};

export type timeLineType = {
  userId: number;
  userName: string;
  userNum: number;
  seatNum: number;
  cheatingStatistics: cheatingStatistics[];
  cheatingVideos: cheatingVideo[];
};

export const dummyTimeLineData: timeLineType = {
  userId: 1,
  userName: "김호정",
  userNum: 2022111111,
  seatNum: 23,
  cheatingStatistics: [
    {
      cheatingStatisticsId: 1,
      cheatingType: "휴대폰 사용",
      cheatingCount: 2,
      DetectedTime: "2023-11-02T10:20:00",
    },
    {
      cheatingStatisticsId: 2,
      cheatingType: "시선 이탈",
      cheatingCount: 5,
      DetectedTime: "2023-11-02T10:25:00",
    },
    {
      cheatingStatisticsId: 3,
      cheatingType: "종이 사용",
      cheatingCount: 1,
      DetectedTime: "2023-11-02T10:30:00",
    },
  ],
  cheatingVideos: [
    {
      videoId: 1,
      startTime: "2023-11-02T10:20:00",
      endTime: "2023-11-02T10:22:00",
      filepath: "/videos/cheating_1.mp4",
    },
    {
      videoId: 2,
      startTime: "2023-11-02T10:25:00",
      endTime: "2023-11-02T10:27:00",
      filepath: "/videos/cheating_2.mp4",
    },
    {
      videoId: 3,
      startTime: "2023-11-02T10:30:00",
      endTime: "2023-11-02T10:31:00",
      filepath: "/videos/cheating_3.mp4",
    },
  ],
};
