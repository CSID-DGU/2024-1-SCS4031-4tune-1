package com.fortune.eyesee.enums;

public enum CheatingTypeEnum {
    LOOK_AROUND("look_around", "주변 응시"),
    REPEATED_GAZE("repeated_gaze", "반복된 응시"),
    OBJECT("object", "부정행위 물체 감지"),
    FACE_ABSENCE_LONG("face_absence_long", "장기 화면 이탈"),
    FACE_ABSENCE_REPEAT("face_absence_repeat", "반복 화면 이탈"),
    HAND_GESTURE("hand_gesture", "특정 손동작 반복"),
    HEAD_TURN_LONG("head_turn_long", "고개 돌림 유지"),
    HEAD_TURN_REPEAT("head_turn_repeat", "고개 돌림 반복");

    private final String englishName;
    private final String koreanName;

    CheatingTypeEnum(String englishName, String koreanName) {
        this.englishName = englishName;
        this.koreanName = koreanName;
    }

    public String getEnglishName() {
        return englishName;
    }

    public String getKoreanName() {
        return koreanName;
    }

    public static String getKoreanNameByEnglish(String englishName) {
        for (CheatingTypeEnum type : values()) {
            if (type.getEnglishName().equalsIgnoreCase(englishName)) { // 대소문자 무시 비교
                return type.getKoreanName();
            }
        }
        return "알 수 없음";
    }
}
