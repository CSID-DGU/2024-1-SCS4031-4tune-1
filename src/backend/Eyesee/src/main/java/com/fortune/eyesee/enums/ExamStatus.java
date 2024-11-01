package com.fortune.eyesee.enums;

public enum ExamStatus {
    BEFORE,      // 시험 전 상태
    IN_PROGRESS, // 시험 진행 중 상태
    DONE         // 시험 완료 상태
    ;

    // 문자열을 ExamStatus로 변환하는 메서드
    public static ExamStatus fromString(String status) {
        if (status == null) {
            return null; // null인 경우 null 반환
        }

        try {
            return ExamStatus.valueOf(status.toUpperCase()); // 소문자를 대문자로 변환하여 Enum 값 찾기
        } catch (IllegalArgumentException e) {
            return null; // 유효하지 않은 값인 경우 null 반환
        }
    }
}