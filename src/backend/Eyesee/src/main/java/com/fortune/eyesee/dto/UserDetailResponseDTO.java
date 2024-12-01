package com.fortune.eyesee.dto;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class UserDetailResponseDTO {
    private Integer userId;
    private String userName;
    private Integer userNum;
    private Integer seatNum;
    private List<CheatingStatistic> cheatingStatistics;
    private List<CheatingVideo> cheatingVideos;
    private String examName;
    private LocalTime examStartTime;        // 시험 시작 시간
    private Integer examDuration;           // 진행 시간

    public UserDetailResponseDTO(Integer userId, String userName, Integer userNum, Integer seatNum,
                                 List<CheatingStatistic> cheatingStatistics, List<CheatingVideo> cheatingVideos
            , String examName, LocalTime examStartTime, Integer examDuration) {
        this.userId = userId;
        this.userName = userName;
        this.userNum = userNum;
        this.seatNum = seatNum;
        this.cheatingStatistics = cheatingStatistics;
        this.cheatingVideos = cheatingVideos;
        this.examName = examName;
        this.examStartTime = examStartTime;
        this.examDuration = examDuration;
    }

//    @Data
//    public static class CheatingStatistic {
//        private Integer cheatingStatisticsId;
//        private String cheatingTypeName; // String으로 변경git
//        private Integer cheatingCount;
//        private String detectedTime;
//
//        // 부정행위 통계 생성자
//        public CheatingStatistic(Integer cheatingStatisticsId, String cheatingTypeName, Integer cheatingCount, String detectedTime) {
//            this.cheatingStatisticsId = cheatingStatisticsId;
//            this.cheatingTypeName = cheatingTypeName;
//            this.cheatingCount = cheatingCount;
//            this.detectedTime = detectedTime != null ? detectedTime : "N/A"; // 기본값 "N/A"
//        }
//    }


    @Data
    public static class CheatingVideo {
        private Integer videoId;
        private String startTime;
        private String endTime;
        private String filepath;

        //부정행위 관련 비디오 정보 생성자
        public CheatingVideo(Integer videoId, String startTime, String endTime, String filepath) {
            this.videoId = videoId;
            this.startTime = startTime;
            this.endTime = endTime;
            this.filepath = filepath != null ? filepath : "No file available"; // 기본값
        }
    }
}
