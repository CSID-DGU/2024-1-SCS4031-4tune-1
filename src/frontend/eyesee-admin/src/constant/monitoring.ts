export const enum MonitoringCondition {
  NOT_LOOKING_AROUND = "NOT_LOOKING_AROUND", // 주변을 5초 이상 응시
  REPEATED_GAZE = "REPEATED_GAZE", // 동일한 곳을 3초 이상 5번 응시
  DEVICE_DETECTION = "DEVICE_DETECTION", // 스마트폰, 작은 종이 포착
  OFF_SCREEN = "OFF_SCREEN", // 화면에서 5초 이상 이탈
  FREQUENT_OFF_SCREEN = "FREQUENT_OFF_SCREEN", // 화면에서 3초 이상 5번 이탈
  REPEATED_HAND_GESTURE = "REPEATED_HAND_GESTURE", // 특정 손동작 반복
  TURNING_AWAY = "TURNING_AWAY", // 고개를 돌리고 5초 이상 유지
  SPECIFIC_POSITION_BEHAVIOR = "SPECIFIC_POSITION_BEHAVIOR", // 특정 위치로 고개를 돌리는 행동
}
