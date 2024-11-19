package com.fortune.eyesee.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class CheatingResponseDTO {
    private String userId; // 사용자 ID
    private Map<String, Integer> cheatingCounts; // 부정행위 카운트 (ex: {"look_around": 2, "repeated_gaze": 1})
    private LocalDateTime timestamp; // ISO 포맷의 탐지 시간 (LocalDateTime으로 매핑)
}