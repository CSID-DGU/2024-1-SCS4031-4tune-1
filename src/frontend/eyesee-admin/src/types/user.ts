export type testSesstion = {
  examName: string;
  examStudentNumber: number;
  examDuration: number;
  user: user[];
};

export type user = {
  userId: number;
  userName: string;
  userNum: number;
  seatNum: number;
  cheatingCount: number;
};

export const testSesstionData: testSesstion = {
  examName: "융합캡스톤디자인 중간시험",
  examStudentNumber: 20,
  examDuration: 120,
  user: [
    {
      userId: 1,
      userName: "김호정",
      userNum: 2022111111,
      seatNum: 1,
      cheatingCount: 1,
    },
    {
      userId: 2,
      userName: "박서윤",
      userNum: 2022111112,
      seatNum: 2,
      cheatingCount: 0,
    },
    {
      userId: 3,
      userName: "이준혁",
      userNum: 2022111113,
      seatNum: 3,
      cheatingCount: 2,
    },
    {
      userId: 4,
      userName: "최민준",
      userNum: 2022111114,
      seatNum: 4,
      cheatingCount: 0,
    },
    {
      userId: 5,
      userName: "김지우",
      userNum: 2022111115,
      seatNum: 5,
      cheatingCount: 1,
    },
    {
      userId: 6,
      userName: "박하윤",
      userNum: 2022111116,
      seatNum: 6,
      cheatingCount: 0,
    },
    {
      userId: 7,
      userName: "이도윤",
      userNum: 2022111117,
      seatNum: 7,
      cheatingCount: 3,
    },
    {
      userId: 8,
      userName: "정민서",
      userNum: 2022111118,
      seatNum: 8,
      cheatingCount: 0,
    },
    {
      userId: 9,
      userName: "송지호",
      userNum: 2022111119,
      seatNum: 9,
      cheatingCount: 0,
    },
    {
      userId: 10,
      userName: "김하은",
      userNum: 2022111120,
      seatNum: 10,
      cheatingCount: 2,
    },
    {
      userId: 11,
      userName: "장우진",
      userNum: 2022111121,
      seatNum: 11,
      cheatingCount: 0,
    },
    {
      userId: 12,
      userName: "윤채원",
      userNum: 2022111122,
      seatNum: 12,
      cheatingCount: 1,
    },
    {
      userId: 13,
      userName: "홍준영",
      userNum: 2022111123,
      seatNum: 13,
      cheatingCount: 0,
    },
    {
      userId: 14,
      userName: "서다인",
      userNum: 2022111124,
      seatNum: 14,
      cheatingCount: 0,
    },
    {
      userId: 15,
      userName: "조성호",
      userNum: 2022111125,
      seatNum: 15,
      cheatingCount: 2,
    },
    {
      userId: 16,
      userName: "강민주",
      userNum: 2022111126,
      seatNum: 16,
      cheatingCount: 0,
    },
    {
      userId: 17,
      userName: "오하율",
      userNum: 2022111127,
      seatNum: 17,
      cheatingCount: 1,
    },
    {
      userId: 18,
      userName: "신우진",
      userNum: 2022111128,
      seatNum: 18,
      cheatingCount: 0,
    },
    {
      userId: 19,
      userName: "한수민",
      userNum: 2022111129,
      seatNum: 19,
      cheatingCount: 0,
    },
    {
      userId: 20,
      userName: "유서영",
      userNum: 2022111130,
      seatNum: 20,
      cheatingCount: 3,
    },
  ],
};
