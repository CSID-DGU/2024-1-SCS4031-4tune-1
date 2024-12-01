package com.fortune.eyesee.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fortune.eyesee.enums.ExamStatus;
import com.fortune.eyesee.utils.CheatingTypeConverter;
import lombok.Data;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Entity
@Table(name = "Exam")
@Data
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer examId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adminId", nullable = false)
    private Admin admin;

    private String examName;                // 시험명
    private String examSemester;            // 학기
    private Integer examStudentNumber;      // 학생 수
    private String examLocation;            // 시험 장소
    private LocalDate examDate;             // 시험 날짜
    private LocalTime examStartTime;        // 시험 시작 시간
    private Integer examDuration;           // 진행 시간
    private Integer examQuestionNumber;     // 질문 수
    private Integer examTotalScore;         // 총점

    @Enumerated(EnumType.STRING)
    private ExamStatus examStatus;          // 시험 상태

    private String examRandomCode;          // 랜덤 코드
    private String examNotice;              // 공지사항

    @OneToOne(mappedBy = "exam", cascade = CascadeType.ALL)
    private Session session; // 1:1 관계 설정

    @Convert(converter = CheatingTypeConverter.class) // JSON 컬럼 변환기
    private List<String> cheatingTypes;
}