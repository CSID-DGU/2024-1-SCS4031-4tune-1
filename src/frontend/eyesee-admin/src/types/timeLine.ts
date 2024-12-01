export type cheatingStatistics = {
  cheatingStatisticsId: number;
  koreanTypeName: string;
  cheatingCount: number;
  detectedTime: string;
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
  examName: string;
  examStartTime: string;
  examDuration: number;
};

export const dummyTimeLineData: timeLineType = {
  userId: 1,
  userName: "김호정",
  userNum: 2022111111,
  seatNum: 23,
  cheatingStatistics: [
    {
      cheatingStatisticsId: 1,
      koreanTypeName: "휴대폰 사용",
      cheatingCount: 2,
      detectedTime: "2023-11-02T10:20:00",
    },
    {
      cheatingStatisticsId: 2,
      koreanTypeName: "시선 이탈",
      cheatingCount: 5,
      detectedTime: "2023-11-02T10:25:00",
    },
    {
      cheatingStatisticsId: 3,
      koreanTypeName: "종이 사용",
      cheatingCount: 1,
      detectedTime: "2023-11-02T10:30:00",
    },
  ],
  cheatingVideos: [
    {
      videoId: 1,
      startTime: "2023-11-02T10:20:00",
      endTime: "2023-11-02T10:22:00",
      filepath:
        "https://videos.pexels.com/video-files/4769538/4769538-uhd_2732_1440_25fps.mp4",
    },
    {
      videoId: 2,
      startTime: "2023-11-02T10:25:00",
      endTime: "2023-11-02T10:27:00",
      filepath:
        "https://videos.pexels.com/video-files/8196796/8196796-hd_1920_1080_25fps.mp4",
    },
    {
      videoId: 3,
      startTime: "2023-11-02T10:30:00",
      endTime: "2023-11-02T10:31:00",
      filepath:
        "https://videos.pexels.com/video-files/4778714/4778714-uhd_2732_1440_25fps.mp4",
    },
  ],
  examName: "test",
  examStartTime: "05:30:00",
  examDuration: 120,
};
