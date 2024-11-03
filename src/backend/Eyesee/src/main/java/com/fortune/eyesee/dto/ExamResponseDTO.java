package com.fortune.eyesee.dto;

import com.fortune.eyesee.enums.ExamStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
public class ExamResponseDTO {
    private Integer examId;
    private String examName;
    private String examSemester;
    private Integer examStudentNumber;
    private String examLocation;
    private LocalDate examDate;
    private LocalTime examStartTime;
    private Integer examDuration;
    private ExamStatus examStatus;
    private String examNotice;

    private Integer sessionId; // Session의 ID
    private String examRandomCode; // 추가 examRandomCode
}