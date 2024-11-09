package com.fortune.eyesee.dto;

import lombok.Data;

@Data
public class StudentSessionRequestDTO {
    private String examCode;
    private Integer userNum;
    private String userName;
    private String department;
    private Integer seatNum;
}