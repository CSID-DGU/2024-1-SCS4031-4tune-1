package com.fortune.eyesee.service;

import org.springframework.stereotype.Service;

@Service
public class CheatingTypeMappingService {

    /**
     * AI 서버의 부정행위 유형 문자열을 CheatingTypeId로 매핑
     *
     * @param cheatingTypeName 부정행위 유형 이름 (AI 서버 반환 값)
     * @return CheatingTypeId (매핑된 ID)
     */
    public Integer getCheatingTypeId(String cheatingTypeName) {
        switch (cheatingTypeName) {
            case "look_around":
                return 1;
            case "repeated_gaze":
                return 2;
            case "object":
                return 3;
            case "face_absence_long":
                return 4;
            case "face_absence_repeat":
                return 5;
            case "hand_gesture":
                return 6;
            case "head_turn_long":
                return 7;
            case "head_turn_repeat":
                return 8;
            case "eye_movement":
                return 9;
            default:
                throw new IllegalArgumentException("Unknown cheating type: " + cheatingTypeName);
        }
    }
}
