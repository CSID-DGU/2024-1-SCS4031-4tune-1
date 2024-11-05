package com.fortune.eyesee.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "Session")
@Data
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sessionId; // 자동 증가


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examId", nullable = false) // examId를 외래 키로 설정
    private Exam exam; // Exam과 1:1 관계

    private String sessionReport;
}