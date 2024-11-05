package com.fortune.eyesee.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

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
}
