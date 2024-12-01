package com.fortune.eyesee.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ExamReportResponseDTO {
    private String examName;                    // 시험 이름
    private Integer totalCheatingCount;         // 총 탐지된 부정행위 건수
    private Integer cheatingStudentsCount;      // 부정행위 탐지된 학생 수
    private Double averageCheatingCount;        // 평균 부정행위 탐지 건수
    private String maxCheatingStudent;          // 최다 부정행위 탐지 학생 학번 및 이름
    private Double cheatingRate;                // 부정행위 탐지율
    private Map<String, Integer> cheatingTypeStatistics; // 부정행위 유형별 통계
    private String peakCheatingTimeRange;       // 부정행위 발생 시간대
}
