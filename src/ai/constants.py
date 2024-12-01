# 부정행위 감지 임계값 설정

# 1. 주변 응시 감지
LOOK_AROUND_THRESHOLD = 5         # 주변을 5초 이상 응시

# 2. 동일 위치 반복 응시 감지
REPEATED_GAZE_DURATION = 3        # 동일 위치에서 3초 이상 응시
REPEATED_GAZE_COUNT = 5           # 30초 이내에 5번
REPEATED_GAZE_WINDOW = 30         # 30초의 시간 창

# 3. 부정행위 물체 감지
CHEATING_OBJECTS = ['cell phone', 'small paper']  # 스마트폰, 작은 종이

# 4. 장기 화면 이탈 감지
FACE_ABSENCE_THRESHOLD = 5        # 화면에서 5초 이상 이탈

# 5. 반복 화면 이탈 감지
FACE_ABSENCE_DURATION = 3         # 이탈 지속 시간 3초
FACE_ABSENCE_COUNT_THRESHOLD = 5  # 30초 이내에 5번 이탈
FACE_ABSENCE_WINDOW = 30          # 30초의 시간 창

# 6. 특정 손동작 반복 감지
HAND_GESTURE_THRESHOLD = 2        # 손동작이 2초 이상 지속될 때 부정행위로 간주
HAND_GESTURE_EXCLUDE = ['fist', 'palm']  # 제외할 손동작 목록

# 7. 고개 돌림 유지 감지
HEAD_TURN_THRESHOLD = 15          # 고개 돌림 각도 임계값 (Yaw)
HEAD_TURN_DURATION = 5            # 고개 돌리고 5초 이상 유지

# 8. 고개 돌림 반복 감지
HEAD_TURN_REPEAT_DURATION = 3     # 고개 돌림 반복 시 3초 이상
HEAD_TURN_COUNT_THRESHOLD = 5     # 30초 이내에 5번 행함
HEAD_TURN_WINDOW = 30             # 30초의 시간 창

# 기타 상수
PITCH_DOWN_THRESHOLD = 30         # 아래를 보고 있다고 판단할 Pitch 각도 임계값
YAW_FORWARD_THRESHOLD = 20        # 정면을 보고 있다고 판단할 Yaw 각도 임계값
GRID_ROWS = 3                     # 시선 추적 격자 행 수
GRID_COLS = 3                     # 시선 추적 격자 열 수

# 부정행위 메시지 표시 시간
CHEATING_MESSAGE_DURATION = 3     # 부정행위 메시지를 화면에 표시할 시간 (초)