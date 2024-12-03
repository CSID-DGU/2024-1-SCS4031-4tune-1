export const enum MonitoringCondition {
  NOT_LOOKING_AROUND = "look_around", // 주변을 5초 이상 응시
  REPEATED_GAZE = "repeated_gaze", // 동일한 곳을 3초 이상 5번 응시
  DEVICE_DETECTION = "object", // 스마트폰, 작은 종이 포착
  OFF_SCREEN = "face_absence_long", // 화면에서 5초 이상 이탈
  FREQUENT_OFF_SCREEN = "face_absence_repeat", // 화면에서 3초 이상 5번 이탈
  REPEATED_HAND_GESTURE = "hand_gesture", // 특정 손동작 반복
  TURNING_AWAY = "head_turn_long", // 고개를 돌리고 5초 이상 유지
  SPECIFIC_POSITION_BEHAVIOR = "head_turn_repeat", // 특정 위치로 고개를 돌리는 행동
}
