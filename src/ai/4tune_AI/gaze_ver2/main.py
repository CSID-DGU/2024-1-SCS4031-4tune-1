import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import mediapipe as mp
import torch
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from detectors import *
from starlette.responses import JSONResponse
from collections import defaultdict, deque
import time
import asyncio
import numpy as np
import cv2

app = FastAPI()

# 부정행위 감지에 필요한 전역 변수 초기화
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
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# 유저별 이미지 저장소
user_images = defaultdict(deque)

# 이미지 저장 기간 (초)
IMAGE_RETENTION_TIME = 5  # 최근 5초간의 이미지를 저장

# 부정행위 관련 변수 초기화
start_times = defaultdict(lambda: {
    'look_around': None,
    'face_absence': None,
    'head_turn': None,
    'hand_gesture': None,
    'eye_movement': None,
    'repeated_gaze': None
})
cheating_flags = defaultdict(lambda: {
    'look_around': False,
    'repeated_gaze': False,
    'object': False,
    'face_absence_long': False,
    'face_absence_repeat': False,
    'hand_gesture': False,
    'head_turn_long': False,
    'head_turn_repeat': False,
    'eye_movement': False
})
cheating_counts = defaultdict(lambda: {
    'look_around': 0,
    'repeated_gaze': 0,
    'object': 0,
    'face_absence_long': 0,
    'face_absence_repeat': 0,
    'hand_gesture': 0,
    'head_turn_long': 0,
    'head_turn_repeat': 0,
    'eye_movement': 0
})

gaze_history = defaultdict(list)
face_absence_history = defaultdict(list)
head_turn_history = defaultdict(list)

# 부정행위 메시지를 저장할 딕셔너리
cheating_messages = defaultdict(list)

class CheatingResult(BaseModel):
    user_id: str
    cheating_counts: dict
    timestamp: str

@app.post("/process_video")
async def process_video(user_id: str = Form(...), uploaded_file: UploadFile = File(...)):
    # 이미지 데이터 읽기
    image_bytes = await uploaded_file.read()
    timestamp = time.time()

    # 이미지가 비어 있는지 확인
    if not image_bytes:
        return JSONResponse(content={"error": "파일이 비어 있습니다."}, status_code=400)

    # 이미지 디코딩
    image_np = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # 이미지 디코딩 성공 여부 확인
    if image is None:
        return JSONResponse(content={"error": "이미지 디코딩에 실패했습니다."}, status_code=400)

    # 유저별 이미지 저장
    user_images[user_id].append((image_bytes, timestamp))

    # 오래된 이미지 삭제
    remove_old_images(user_id)

    # 부정행위 탐지를 비동기적으로 처리하고 결과를 기다림
    result = await process_user_images(user_id)

    # 현재 시간
    current_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))

    # 결과 반환
    response = {
        'user_id': user_id,
        'cheating_counts': result,
        'timestamp': current_time
    }

    return JSONResponse(content=response)

def remove_old_images(user_id):
    current_time = time.time()
    while user_images[user_id] and current_time - user_images[user_id][0][1] > IMAGE_RETENTION_TIME:
        user_images[user_id].popleft()

async def process_user_images(user_id):
    images_with_timestamps = list(user_images[user_id])

    # 이미지 처리 및 부정행위 탐지
    for image_data, timestamp in images_with_timestamps:
        image_np = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        await process_frame(user_id, image, timestamp)

    # 유저의 부정행위 카운트 반환
    return cheating_counts[user_id]

async def process_frame(user_id, image, frame_timestamp):
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

    # 이미지 쓰기 권한 재설정
    image_rgb.flags.writeable = True

    # 객체 탐지
    object_results = model(image_for_detection)

    # 객체 탐지 결과 처리
    detections = []
    for *box, conf, cls in object_results.xyxy[0]:
        if conf >= 0.6:  # 신뢰도 임계값 조정
            name = object_results.names[int(cls)]
            x1, y1, x2, y2 = map(int, box)
            detections.append({'name': name, 'bbox': (x1, y1, x2, y2), 'conf': float(conf)})

    # 부정행위 물체 감지
    detect_object_presence(user_id, detections, cheating_flags, cheating_counts, cheating_messages, image)

    # 얼굴 부정행위 감지 (자리 이탈)
    detect_face_absence(user_id, face_present, start_times, cheating_flags, cheating_counts, face_absence_history, cheating_messages)

    if face_mesh_results.multi_face_landmarks:
        face_landmarks = face_mesh_results.multi_face_landmarks[0]
        landmarks = get_landmarks(face_landmarks, image.shape)

        # 머리 자세 추정
        pitch, yaw, roll = calculate_head_pose(landmarks, image.shape)

        # 주변 응시 감지
        detect_look_around(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages)

        # 고개 돌림 감지
        detect_head_turn(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history, cheating_messages)

        # 눈동자 움직임 감지
        eye_center = calculate_eye_position(landmarks)
        detect_eye_movement(user_id, eye_center, image.shape, start_times, cheating_flags, cheating_counts, cheating_messages)

        # 시선 위치 추정
        gaze_point = get_gaze_position(landmarks)

        # 화면을 격자로 나누어 시선 위치를 감지
        grid_row = int(gaze_point[1] / (image.shape[0] / GRID_ROWS))
        grid_col = int(gaze_point[0] / (image.shape[1] / GRID_COLS))
        grid_position = (grid_row, grid_col)

        # 동일 위치 반복 응시 감지
        detect_repeated_gaze(user_id, grid_position, gaze_history, start_times, cheating_flags, cheating_counts, cheating_messages, pitch)

    else:
        # 얼굴 랜드마크가 검출되지 않는 경우
        start_times[user_id]['look_around'] = None
        cheating_flags[user_id]['look_around'] = False
        start_times[user_id]['head_turn'] = None
        cheating_flags[user_id]['head_turn_long'] = False

    # 손동작 감지
    if hands_results.multi_hand_landmarks:
        hand_landmarks_list = hands_results.multi_hand_landmarks
        detect_hand_gestures(user_id, hand_landmarks_list, start_times, cheating_flags, cheating_counts, cheating_messages)
    else:
        start_times[user_id]['hand_gesture'] = None
        cheating_flags[user_id]['hand_gesture'] = False

# FastAPI 실행 (개발용)
# uvicorn main:app --host 0.0.0.0 --port 8000