package com.fortune.eyesee.entity;

import lombok.Data;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "VideoRecording")
@Data
public class VideoRecording {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer videoId;

    private Integer sessionId;              // 세션 ID
    private Integer userId;                 // 사용자 ID
    private LocalDate examDate;             // 시험 날짜
    private LocalTime examStartTime;        // 시험 시작 시간
    private String filePath;                // 파일 경로
}