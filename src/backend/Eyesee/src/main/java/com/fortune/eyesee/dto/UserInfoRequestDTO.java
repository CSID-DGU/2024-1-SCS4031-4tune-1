
package com.fortune.eyesee.dto;

import lombok.Data;

@Data
public class UserInfoRequestDTO {
    private String examCode;   // 시험 코드
    private String name;       // 사용자 이름
    private String department; // 학과
    private Integer userNum;   // 학번
    private Integer seatNum;   // 좌석 번호
}
