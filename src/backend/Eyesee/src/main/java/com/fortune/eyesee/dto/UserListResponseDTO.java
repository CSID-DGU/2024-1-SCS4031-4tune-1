package com.fortune.eyesee.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserListResponseDTO {
    private String examName;
    private Integer examStudentNumber;
    private Integer examDuration;
    private List<UserInfo> user;

    // 시험 이름, 참가자 수, 시간 등의 정보를 포함한 생성자
    public UserListResponseDTO(String examName, Integer examStudentNumber, Integer examDuration, List<UserInfo> user) {
        this.examName = examName;
        this.examStudentNumber = examStudentNumber;
        this.examDuration = examDuration;
        this.user = user;
    }

    @Data
    public static class UserInfo {
        private Integer userId;
        private String userName;
        private Integer userNum;
        private Integer seatNum;
        private Integer cheatingCount;

        // 사용자 고유 ID, 이름, 학번, 좌석 번호, 부정행위 횟수를 포함한 생성자
        public UserInfo(Integer userId, String userName, Integer userNum, Integer seatNum, Integer cheatingCount) {
            this.userId = userId;
            this.userName = userName;
            this.userNum = userNum;
            this.seatNum = seatNum;
            this.cheatingCount = cheatingCount;
        }
    }
}