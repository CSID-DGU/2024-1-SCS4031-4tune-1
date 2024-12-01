package com.fortune.eyesee.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ExamRequestDTO {
    private String examName;
    private String examSemester;
    private Integer examStudentNumber;
    private String examLocation;
    private LocalDate examDate;
    private LocalTime examStartTime;
    private Integer examDuration;
    private Integer examQuestionNumber;
    private Integer examTotalScore;
    private String examNotice;

    private List<String> cheatingTypes; // 부정행위 유형 리스트
}