import cv2
import mediapipe as mp
import time

from utils import draw_text_korean, calculate_head_pose, calculate_eye_direction, detect_hand_gesture
from constants import CHEATING_THRESHOLD, HEAD_TURN_THRESHOLD, EYE_TURN_THRESHOLD
from detectors import (
    detect_face_absence,
    detect_head_turn,
    detect_eye_movement,
    detect_hand_gesture_wrapper
)

# MediaPipe 초기화
mp_face_mesh = mp.solutions.face_mesh
mp_face_detection = mp.solutions.face_detection
mp_hands = mp.solutions.hands

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)
hands = mp_hands.Hands(
    max_num_hands=2,  # 두 손 인식을 위해 2로 설정
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# 그리기 유틸리티
mp_drawing = mp.solutions.drawing_utils

# 부정행위 관련 변수 초기화
start_times = {'head': None, 'eye': None, 'face': None, 'hand': {}}
cheating_flags = {'head': False, 'eye': False, 'face': False, 'hand': {}}
cheating_counts = {'head': 0, 'eye': 0, 'face': 0, 'hand': {}}

# 웹캠 열기
cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("카메라에서 프레임을 읽을 수 없습니다.")
        break

    # 성능 향상을 위해 이미지 쓰기 권한 해제
    image.flags.writeable = False
    # BGR 이미지를 RGB로 변환
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 얼굴 검출
    face_results = face_detection.process(image_rgb)
    face_present = False if not face_results.detections else True

    # 얼굴 부정행위 감지
    detect_face_absence(face_present, start_times, cheating_flags, cheating_counts)

    # 얼굴 랜드마크 추출
    face_mesh_results = face_mesh.process(image_rgb)

    # 손 랜드마크 추출
    hands_results = hands.process(image_rgb)

    # 이미지 쓰기 권한 재설정
    image.flags.writeable = True
    # RGB 이미지를 BGR로 변환
    image = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

    if face_mesh_results.multi_face_landmarks:
        face_landmarks = face_mesh_results.multi_face_landmarks[0]

        # 머리 자세 추정
        pitch, yaw, roll = calculate_head_pose(face_landmarks, image.shape)

        # 머리 부정행위 감지
        detect_head_turn(yaw, start_times, cheating_flags, cheating_counts)

        # 눈동자 움직임 추적
        eye_angle = calculate_eye_direction(face_landmarks, image.shape)

        # 눈동자 부정행위 감지
        detect_eye_movement(eye_angle, start_times, cheating_flags, cheating_counts)

        # 얼굴 랜드마크 그리기 (디버깅용)
        mp_drawing.draw_landmarks(
            image, face_landmarks, mp_face_mesh.FACEMESH_CONTOURS,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)
        )

        # 머리 자세 정보 표시
        text = f'Yaw(좌우): {yaw:.1f}, Pitch(상하): {pitch:.1f}, Roll(기울기): {roll:.1f}'
        image = draw_text_korean(image, text, (30, 30), font_size=20, font_color=(255, 255, 255))

    else:
        # 얼굴 랜드마크가 검출되지 않는 경우
        start_times['head'] = None
        cheating_flags['head'] = False
        start_times['eye'] = None
        cheating_flags['eye'] = False

    # 손동작 감지
    if hands_results.multi_hand_landmarks:
        for hand_landmarks, hand_info in zip(hands_results.multi_hand_landmarks, hands_results.multi_handedness):
            hand_label = hand_info.classification[0].label  # 'Left' 또는 'Right'

            # 부정행위 관련 변수 초기화
            if hand_label not in start_times['hand']:
                start_times['hand'][hand_label] = None
                cheating_flags['hand'][hand_label] = False
                cheating_counts['hand'][hand_label] = 0

            # 부정행위 제스처 감지
            hand_gesture_detected = detect_hand_gesture(hand_landmarks)

            # 손동작 부정행위 감지
            detect_hand_gesture_wrapper(hand_gesture_detected, hand_label, start_times, cheating_flags, cheating_counts)

            # 손 랜드마크 그리기 (디버깅용)
            mp_drawing.draw_landmarks(
                image, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2)
            )
    else:
        start_times['hand'] = {}
        cheating_flags['hand'] = {}

    # 부정행위 상태 표시
    status_text = ''
    if cheating_flags['face']:
        status_text += '부정행위 감지: 얼굴 미검출\n'
    if cheating_flags['head']:
        status_text += '부정행위 감지: 고개 돌림\n'
    if cheating_flags['eye']:
        status_text += '부정행위 감지: 눈동자 돌림\n'
    for hand_label, flag in cheating_flags['hand'].items():
        if flag:
            status_text += f'부정행위 감지: 손동작 (손: {hand_label})\n'
    if status_text == '':
        status_text = '정상 상태'

    # 상태 표시
    y0, dy = 60, 30
    for i, line in enumerate(status_text.strip().split('\n')):
        y = y0 + i * dy
        image = draw_text_korean(
            image,
            line,
            (30, y),
            font_size=20,
            font_color=(0, 0, 255) if '부정행위' in line else (0, 255, 0)
        )

    # 결과 이미지 출력
    cv2.imshow('Gaze and Motion Tracking', image)

    if cv2.waitKey(5) & 0xFF == 27:  # ESC 키를 누르면 종료
        break

cap.release()
cv2.destroyAllWindows()