# main.py

import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import cv2
import mediapipe as mp
import torch
import time
from custom_utils import *
from constants import *
from detectors import *

def main():
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
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    # 객체 탐지 모델 로드 (YOLOv5l)
    model = torch.hub.load('ultralytics/yolov5', 'yolov5l')

    # 부정행위 관련 변수 초기화
    start_times = {
        'look_around': None,
        'face_absence': None,
        'head_turn': None,
        'hand_gesture': None,
        'eye_movement': None,
        'repeated_gaze': None
    }
    cheating_flags = {
        'look_around': False,
        'repeated_gaze': False,
        'object': False,
        'face_absence_long': False,
        'face_absence_repeat': False,
        'hand_gesture': False,
        'head_turn_long': False,
        'head_turn_repeat': False,
        'eye_movement': False
    }
    cheating_counts = {
        'look_around': 0,
        'repeated_gaze': 0,
        'object': 0,
        'face_absence_long': 0,
        'face_absence_repeat': 0,
        'hand_gesture': 0,
        'head_turn_long': 0,
        'head_turn_repeat': 0,
        'eye_movement': 0
    }

    gaze_history = []
    face_absence_history = []
    head_turn_history = []

    # 부정행위 메시지를 저장할 리스트
    cheating_messages = []

    # 웹캠 열기
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("카메라에서 프레임을 읽을 수 없습니다.")
            break

        # 이미지 복사 (객체 탐지용)
        image_for_detection = image.copy()

        # BGR 이미지를 RGB로 변환
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # 성능 향상을 위해 이미지 쓰기 권한 해제
        image_rgb.flags.writeable = False

        # 얼굴 검출
        face_detection_results = face_detection.process(image_rgb)
        face_present = face_detection_results.detections is not None

        # 얼굴 랜드마크 추출
        face_mesh_results = face_mesh.process(image_rgb)

        # 손 랜드마크 추출
        hands_results = hands.process(image_rgb)

        # 객체 탐지
        object_results = model(image_for_detection)

        # 이미지 쓰기 권한 재설정
        image_rgb.flags.writeable = True

        # 얼굴 부정행위 감지 (자리 이탈)
        detect_face_absence(face_present, start_times, cheating_flags, cheating_counts, face_absence_history, cheating_messages)

        if face_mesh_results.multi_face_landmarks:
            face_landmarks = face_mesh_results.multi_face_landmarks[0]
            landmarks = get_landmarks(face_landmarks, image.shape)

            # 머리 자세 추정
            pitch, yaw, roll = calculate_head_pose(landmarks, image.shape)

            # 주변 응시 감지
            detect_look_around(pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages)

            # 고개 돌림 감지
            detect_head_turn(pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history, cheating_messages)

            # 눈동자 움직임 감지
            eye_center = calculate_eye_position(landmarks)
            detect_eye_movement(eye_center, image.shape, start_times, cheating_flags, cheating_counts, cheating_messages)

            # 눈동자 위치 표시 (시각화)
            cv2.circle(image, eye_center, 5, (0, 255, 0), -1)  # 녹색 원

            # 시선 위치 추정
            gaze_point = get_gaze_position(landmarks)

            # 시선 위치 표시 (시각화)
            cv2.circle(image, gaze_point, 5, (255, 0, 0), -1)  # 파란색 원

            # 화면을 격자로 나누어 시선 위치를 감지
            grid_row = int(gaze_point[1] / (image.shape[0] / GRID_ROWS))
            grid_col = int(gaze_point[0] / (image.shape[1] / GRID_COLS))
            grid_position = (grid_row, grid_col)

            # 동일 위치 반복 응시 감지
            detect_repeated_gaze(grid_position, gaze_history, start_times, cheating_flags, cheating_counts, cheating_messages, pitch)

            # 얼굴 랜드마크 그리기 (디버깅용)
            mp.solutions.drawing_utils.draw_landmarks(
                image, face_landmarks, mp_face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp.solutions.drawing_utils.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)
            )

            # 머리 자세 정보 표시
            text = f'Yaw(좌우 각도): {yaw:.1f}°, Pitch(상하 각도): {pitch:.1f}°'
            image = draw_text_korean(image, text, (30, 30), font_size=20, font_color=(255, 255, 255))

            # 눈동자 위치 표시
            eye_position_text = f'눈동자 위치: ({eye_center[0]}, {eye_center[1]})'
            image = draw_text_korean(image, eye_position_text, (30, 60), font_size=20, font_color=(255, 255, 255))
        else:
            # 얼굴 랜드마크가 검출되지 않는 경우
            # print("얼굴 랜드마크가 검출되지 않았습니다.")
            start_times['look_around'] = None
            cheating_flags['look_around'] = False
            start_times['head_turn'] = None
            cheating_flags['head_turn_long'] = False

        # 손동작 감지
        if hands_results.multi_hand_landmarks:
            hand_landmarks_list = hands_results.multi_hand_landmarks
            detect_hand_gestures(hand_landmarks_list, start_times, cheating_flags, cheating_counts, cheating_messages)

            # 손 랜드마크 그리기 (디버깅용)
            for hand_landmarks in hand_landmarks_list:
                mp.solutions.drawing_utils.draw_landmarks(
                    image, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                    mp.solutions.drawing_utils.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2),
                    mp.solutions.drawing_utils.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2)
                )
        else:
            start_times['hand_gesture'] = None
            cheating_flags['hand_gesture'] = False

        # 객체 탐지 결과 처리
        detections = []
        for *box, conf, cls in object_results.xyxy[0]:
            if conf >= 0.6:  # 신뢰도 임계값 조정
                name = object_results.names[int(cls)]
                x1, y1, x2, y2 = map(int, box)
                detections.append({'name': name, 'bbox': (x1, y1, x2, y2), 'conf': float(conf)})

        # 부정행위 물체 감지
        detect_object_presence(detections, cheating_flags, cheating_counts, cheating_messages, image)

        # 부정행위 메시지 표시
        current_time = time.time()
        cheating_messages[:] = [msg for msg in cheating_messages if current_time - msg['start_time'] <= CHEATING_MESSAGE_DURATION]

        y0, dy = 90, 30
        for i, msg in enumerate(cheating_messages):
            y = y0 + i * dy
            image = draw_text_korean(
                image,
                f'부정행위 감지: {msg["type"]}',
                (30, y),
                font_size=20,
                font_color=(0, 0, 255)
            )

        # 부정행위 발생 횟수 표시
        count_texts = []
        for key, count in cheating_counts.items():
            if count > 0:
                type_name = {
                    'look_around': '주변 응시',
                    'repeated_gaze': '동일 위치 반복 응시',
                    'object': '부정행위 물체 감지',
                    'face_absence_long': '장기 화면 이탈',
                    'face_absence_repeat': '반복 화면 이탈',
                    'hand_gesture': '특정 손동작 반복',
                    'head_turn_long': '고개 돌림 유지',
                    'head_turn_repeat': '고개 돌림 반복',
                    'eye_movement': '눈동자 움직임'
                }.get(key, key)
                count_texts.append(f'{type_name}: {count}회')

        for i, text in enumerate(count_texts):
            y = y0 + (i + len(cheating_messages) + 1) * dy
            image = draw_text_korean(
                image,
                text,
                (30, y),
                font_size=20,
                font_color=(255, 255, 0)
            )

        # 결과 이미지 출력
        cv2.imshow('Cheating Detection', image)

        if cv2.waitKey(5) & 0xFF == 27:  # ESC 키를 누르면 종료
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()