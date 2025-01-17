import mediapipe as mp
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from datetime import datetime
import base64
from ultralytics import YOLO
import torch
import asyncio
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from detectors import *
from custom_utils import *
from constants import *
import aiohttp
import logging
import cv2
import numpy as np
from datetime import datetime, timedelta, timezone
import pytz  # pytz를 사용해 시간대를 처리

BACKEND_API_URL = "https://43.203.23.202.nip.io/api"

KST = timezone(timedelta(hours=9))

# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = FastAPI()

# Mediapipe 초기화
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

# YOLO 모델 로드
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = YOLO('yolo11s.pt').to(device)
logging.info("YOLO 모델 로드 완료")

# 부정행위 관련 변수 초기화
start_times = defaultdict(lambda: {
    'look_around': None,
    'face_absence': None,
    'head_turn': None,
    'hand_gesture': None,
    'repeated_gaze': None,
    'object': None
})
cheating_flags = defaultdict(lambda: {
    'look_around': False,
    'repeated_gaze': False,
    'object': False,
    'face_absence_long': False,
    'face_absence_repeat': False,
    'hand_gesture': False,
    'head_turn_long': False,
    'head_turn_repeat': False
})
cheating_counts = defaultdict(lambda: {
    'look_around': 0,
    'repeated_gaze': 0,
    'object': 0,
    'face_absence_long': 0,
    'face_absence_repeat': 0,
    'hand_gesture': 0,
    'head_turn_long': 0,
    'head_turn_repeat': 0
})
cheating_settings_cache = defaultdict(dict)

gaze_history = defaultdict(list)
face_absence_history = defaultdict(list)
head_turn_history = defaultdict(list)

cheating_messages = defaultdict(list)

class CheatingResult(BaseModel):
    userId: str
    cheatingCounts: dict
    timestamp: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logging.info(f"User {user_id} connected via WebSocket")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logging.info(f"User {user_id} disconnected")

    async def send_message(self, user_id: str, message: dict):
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_json(message)
            logging.debug(f"Sent message to {user_id}: {message}")

manager = ConnectionManager()

# 멀티스레딩을 위한 스레드 풀 설정
executor = ThreadPoolExecutor(max_workers=4)
logging.info("ThreadPoolExecutor 초기화 완료")

previous_cheating_counts = defaultdict(lambda: {
    'look_around': 0,
    'repeated_gaze': 0,
    'object': 0,
    'face_absence_long': 0,
    'face_absence_repeat': 0,
    'hand_gesture': 0,
    'head_turn_long': 0,
    'head_turn_repeat': 0
})

# aiohttp 세션을 전역적으로 생성
session = aiohttp.ClientSession()

@app.on_event("shutdown")
async def shutdown_event():
    await session.close()

@app.websocket("/ws/{user_id}/{exam_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, exam_id: str):
    await manager.connect(user_id, websocket)

    # 부정행위 설정 가져오기
    cheating_settings = await fetch_cheating_settings(exam_id)
    if cheating_settings:
        cheating_settings_cache[exam_id] = cheating_settings
        logging.info(f"Cached cheating settings for examId {exam_id}: {cheating_settings}")
    else:
        logging.error(f"Could not fetch cheating settings for examId {exam_id}")
        # 모든 부정행위 탐지 기능을 활성화하는 기본 설정 사용
        cheating_settings = {
            'look_around': True,
            'repeated_gaze': True,
            'object': True,
            'face_absence_long': True,
            'face_absence_repeat': True,
            'hand_gesture': True,
            'head_turn_long': True,
            'head_turn_repeat': True
        }
        cheating_settings_cache[exam_id] = cheating_settings
        logging.info(f"Using default cheating settings for examId {exam_id}: {cheating_settings}")

    previous_cheating_counts[user_id] = {key: 0 for key in cheating_counts[user_id].keys()}

    try:
        while True:
            data = await websocket.receive_text()
            image_bytes = base64.b64decode(data)
            # 현재 UTC 시간 가져오기
            utc_now = datetime.now(timezone.utc)

            # UTC를 KST로 변환
            kst = pytz.timezone('Asia/Seoul')
            kst_now = utc_now.replace(tzinfo=pytz.utc).astimezone(kst)

            # KST에서 ISO 8601 포맷으로 변환 (시간대 오프셋 제거)
            current_time = kst_now.strftime('%Y-%m-%dT%H:%M:%S')  # 예: 2024-12-02T12:57:51

            image_np = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

            if image is None:
                await websocket.send_json({"error": "이미지 디코딩 실패"})
                continue

            await process_frame(user_id, exam_id, image, current_time)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        logging.exception(f"WebSocket {user_id} 연결 중 오류 발생")
        manager.disconnect(user_id)

async def fetch_cheating_settings(exam_id):
    try:
        async with session.get(f"{BACKEND_API_URL}/exams/{exam_id}/cheating-types") as resp:
            if resp.status == 200:
                return await resp.json()
            else:
                logging.error(f"Failed to fetch cheating settings for examId {exam_id}. Status: {resp.status}")
    except Exception as e:
        logging.exception(f"Error fetching cheating settings for examId {exam_id}")
    return None

async def process_frame(user_id, exam_id, image, frame_timestamp):
    loop = asyncio.get_running_loop()
    try:
        # 이미지 처리
        image_shape, detections, face_present, head_pose, gaze_point, eye_center, hand_landmarks_list = await loop.run_in_executor(
            executor,
            process_image,
            image
        )
        logging.debug(f"{user_id}: 프레임 처리 완료")
    except Exception as e:
        logging.exception(f"{user_id}: 프레임 처리 중 오류 발생")
        return

    # 부정행위 상태 업데이트
    try:
        update_cheating(user_id, exam_id, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list, image_shape)
        logging.debug(f"{user_id}: 부정행위 업데이트 완료")

        # 변경된 경우 전송 및 저장
        await compare_and_send_if_changed(user_id)
    except Exception as e:
        logging.exception(f"{user_id}: 부정행위 업데이트 및 전송 중 오류 발생")

def process_image(image):
    image_shape = image.shape
    image_for_detection = image.copy()
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 얼굴 검출
    face_detection_results = face_detection.process(image_rgb)
    face_present = face_detection_results.detections is not None
    logging.debug(f"Face detected: {face_present}")

    # 얼굴 랜드마크 추출
    face_mesh_results = face_mesh.process(image_rgb)

    # 손 랜드마크 추출
    hands_results = hands.process(image_rgb)

    # 객체 탐지 (YOLO 사용)
    object_results = model(image_for_detection, device=device)
    logging.debug(f"객체 탐지 완료: {len(object_results)} 결과")

    # 객체 탐지 결과 처리
    detections = []
    for result in object_results:
        boxes = result.boxes
        for box in boxes:
            conf = box.conf[0].item()
            cls = int(box.cls[0].item())
            name = model.names[cls]
            if conf >= 0.3 and name in CHEATING_OBJECTS:
                detections.append({'name': name, 'confidence': conf})
    logging.debug(f"{len(detections)} 부정행위 대상 객체 감지")

    # 손동작 감지
    hand_landmarks_list = hands_results.multi_hand_landmarks if hands_results.multi_hand_landmarks else []
    logging.debug(f"손동작 감지된 손 수: {len(hand_landmarks_list)}")

    # 얼굴 랜드마크가 있는 경우 머리 자세 및 시선 감지
    head_pose = None
    gaze_point = None
    eye_center = None
    if face_mesh_results.multi_face_landmarks:
        face_landmarks = face_mesh_results.multi_face_landmarks[0]
        landmarks = get_landmarks(face_landmarks, image_rgb.shape)

        # 머리 자세 추정
        pitch, yaw, roll = calculate_head_pose(landmarks, image_rgb.shape)
        head_pose = {'pitch': pitch, 'yaw': yaw, 'roll': roll}
        logging.debug(f"머리 자세: Pitch={pitch}, Yaw={yaw}, Roll={roll}")

        # 시선 위치 추정
        gaze_point = get_gaze_position(landmarks)
        logging.debug(f"시선 위치: {gaze_point}")

        # 눈동자 위치 계산
        eye_center = calculate_eye_position(landmarks)

    return image_shape, detections, face_present, head_pose, gaze_point, eye_center, hand_landmarks_list

def update_cheating(user_id, exam_id, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list, image_shape):
    cheating_settings = cheating_settings_cache.get(exam_id, {})

    # 동적으로 탐지 로직 활성화
    if cheating_settings.get('OBJECT'):
        detect_object_presence(user_id, detections, cheating_flags, cheating_counts, cheating_messages, image_shape)
    if cheating_settings.get('FACE_ABSENCE_LONG') or cheating_settings.get('FACE_ABSENCE_REPEAT'):
        detect_face_absence(user_id, face_present, start_times, cheating_flags, cheating_counts, face_absence_history, cheating_messages)
    if head_pose:
        pitch = head_pose['pitch']
        yaw = head_pose['yaw']
        if cheating_settings.get('LOOK_AROUND'):
            detect_look_around(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages)
        if cheating_settings.get('HEAD_TURN_LONG') or cheating_settings.get('HEAD_TURN_REPEAT'):
            detect_head_turn(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history, cheating_messages)
        if gaze_point and cheating_settings.get('REPEATED_GAZE'):
            grid_row = int(gaze_point[1] / (image_shape[0] / GRID_ROWS))
            grid_col = int(gaze_point[0] / (image_shape[1] / GRID_COLS))
            grid_position = (grid_row, grid_col)
            detect_repeated_gaze(user_id, grid_position, gaze_history, start_times, cheating_flags, cheating_counts, cheating_messages, pitch)
    if cheating_settings.get('HAND_GESTURE'):
        detect_hand_gestures(user_id, hand_landmarks_list, start_times, cheating_flags, cheating_counts, cheating_messages)

async def compare_and_send_if_changed(user_id: str):
    current_counts = cheating_counts[user_id]

    counts_changed = any(
        current_counts[key] != previous_cheating_counts[user_id][key]
        for key in current_counts
    )

    if counts_changed:

        # 현재 UTC 시간 가져오기
        utc_now = datetime.now(timezone.utc)

        # UTC를 KST로 변환
        kst = pytz.timezone('Asia/Seoul')
        kst_now = utc_now.replace(tzinfo=pytz.utc).astimezone(kst)

        # KST에서 ISO 8601 포맷으로 변환 (시간대 오프셋 제거)
        current_time = kst_now.strftime('%Y-%m-%dT%H:%M:%S')  # 예: 2024-12-02T12:57:51

        cheating_result = CheatingResult(
            userId=user_id,
            cheatingCounts=current_counts,
            timestamp=current_time
        )

        try:
            # 백엔드로 데이터 전송
            async with session.post(f"{BACKEND_API_URL}/cheatings", json=cheating_result.dict()) as resp:
                logging.info(f"Sending cheating result to backend: {cheating_result.dict()}")
                if resp.status == 200:
                    logging.info(f"Cheating result sent successfully: {cheating_result.dict()}")
                else:
                    logging.error(f"Failed to send cheating result: {cheating_result.dict()}")

            # 프론트엔드로 데이터 전송
            await manager.send_message(user_id, cheating_result.dict())

            # 이전 상태를 현재 상태로 업데이트
            previous_cheating_counts[user_id] = current_counts.copy()
            logging.debug(f"{user_id}: 부정행위 메시지 전송 및 이전 상태 업데이트 완료")

            # 메시지 초기화
            cheating_messages[user_id].clear()

        except Exception as e:
            logging.exception(f"Error sending cheating result for {user_id}")