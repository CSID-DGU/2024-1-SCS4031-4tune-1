import mediapipe as mp
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from datetime import datetime
import base64
from ultralytics import YOLO
import torch
import asyncio
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor
from detectors import *
from custom_utils import *
from constants import *
import requests
import aiohttp

import logging
BACKEND_API_URL = "https://43.203.23.202.nip.io/api/cheatings"
# 로깅 설정
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
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

# YOLOv8 모델 로드
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = YOLO('yolo11s.pt').to(device)
logging.info("YOLO11 모델 로드 완료")

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
cheating_settings_cache = defaultdict(lambda: {
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

gaze_history = defaultdict(list)
face_absence_history = defaultdict(list)
head_turn_history = defaultdict(list)

cheating_messages = defaultdict(list)


class CheatingResult(BaseModel):
    userId: int
    cheatingCounts: dict
    timestamp: str
    # messages: list = []  # 부정행위 메시지 추가


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

# 멀티프로세싱을 위한 프로세스 풀 설정
executor = ProcessPoolExecutor(max_workers=4)
logging.info("ProcessPoolExecutor 초기화 완료")

@app.websocket("/ws/{user_id}/{exam_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, exam_id: str):
    await manager.connect(user_id, websocket)

    # Fetch cheating settings from backend
    cheating_settings = await fetch_cheating_settings(exam_id)
    if cheating_settings:
        cheating_settings_cache[exam_id] = cheating_settings
        logging.info(f"Cached cheating settings for examId {exam_id}: {cheating_settings}")
    else:
        logging.error(f"Could not fetch cheating settings for examId {exam_id}")
        await websocket.close()
        return

    try:
        while True:
            # WebSocket 데이터 처리 로직
            data = await websocket.receive_text()
            image_bytes = base64.b64decode(data)
            timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

            image_np = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

            if image is None:
                await websocket.send_json({"error": "이미지 디코딩 실패"})
                continue

            await process_frame(user_id, exam_id, image, timestamp)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        logging.error(f"WebSocket {user_id} 연결 중 오류 발생: {e}")
        manager.disconnect(user_id)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # data는 Base64로 인코딩된 이미지 데이터라고 가정
            image_bytes = base64.b64decode(data)
            timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
            logging.debug(f"Received frame from {user_id} at {timestamp}")

            # 이미지 디코딩
            image_np = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

            # 이미지 디코딩 실패 시 에러 전송
            if image is None:
                error_message = {"error": "이미지 디코딩에 실패했습니다."}
                await websocket.send_json(error_message)
                logging.error(f"{user_id}: 이미지 디코딩 실패")
                continue

            # 프레임 처리
            await process_frame(user_id, image, timestamp)

    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        logging.error(f"WebSocket {user_id} 연결 중 오류 발생: {e}")
        manager.disconnect(user_id)


# 기존에 정의된 cheating_counts와 cheating_messages를 사용하는 로직
async def get_cheating_result(user_id: str):
    # 유저의 부정행위 카운트가 존재하고 1개라도 > 0인 경우에만 진행
    if user_id not in cheating_counts or not any(count > 0 for count in cheating_counts[user_id].values()):
        raise HTTPException(status_code=404, detail="User not found or no cheating detected.")

    # 현재 시간을 timestamp로 설정
    current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

    # CheatingResult 객체 생성 (messages 필드는 비워두어도 됨)
    cheating_result = CheatingResult(
        userId=user_id,
        cheatingCounts=cheating_counts[user_id],
        timestamp=current_time,
        # messages=cheating_messages.get(user_id, [])  # 메시지가 필요하면 추가
    )

    # 부정행위 결과를 JSON 형태로 백엔드 API로 전송
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(BACKEND_API_URL, json=cheating_result.dict()) as resp:
                if resp.status == 200:
                    logging.info(f"Cheating result sent successfully: {cheating_result.dict()}")
                else:
                    logging.error(f"Failed to send cheating result: {cheating_result.dict()}")
        except Exception as e:
            logging.error(f"Error sending cheating result: {e}")


# async def process_frame(user_id, image, frame_timestamp):
#     loop = asyncio.get_event_loop()
#     try:
#         image_shape, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list = await loop.run_in_executor(
#             executor,
#             process_image,
#             image
#         )
#         logging.debug(f"{user_id}: 프레임 처리 완료")
#     except Exception as e:
#         logging.error(f"{user_id}: 프레임 처리 중 오류 발생: {e}")
#         return
#
#     # 부정행위 업데이트
#     try:
#         update_cheating(user_id, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list,
#                         image_shape)
#         logging.debug(f"{user_id}: 부정행위 업데이트 완료")
#     except Exception as e:
#         logging.error(f"{user_id}: 부정행위 업데이트 중 오류 발생: {e}")
#         return
#
#     # 부정행위 메시지 전송
#     if cheating_messages[user_id]:
#         current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#         cheating_result = {
#             "user_id": user_id,
#             "cheating_counts": cheating_counts[user_id],
#             "timestamp": current_time,
#             "messages": cheating_messages[user_id]
#         }
#         try:
#             await get_cheating_result(user_id)
#             await manager.send_message(user_id, cheating_result)
#             cheating_messages[user_id].clear()
#             logging.debug(f"{user_id}: 부정행위 메시지 전송 및 초기화 완료")
#         except Exception as e:
#             logging.error(f"{user_id}: 부정행위 메시지 전송 중 오류 발생: {e}")
#

# 이전 부정행위 카운트를 저장하는 딕셔너리
previous_cheating_counts = defaultdict(lambda: {
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

async def fetch_cheating_settings(exam_id):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{BACKEND_API_URL}/exams/{exam_id}/cheating-types") as resp:
                if resp.status == 200:
                    return await resp.json()
                else:
                    logging.error(f"Failed to fetch cheating settings for examId {exam_id}. Status: {resp.status}")
        except Exception as e:
            logging.error(f"Error fetching cheating settings for examId {exam_id}: {e}")
        return None

# 부정행위 메시지 전송
async def send_cheating_result_if_changed(user_id: str):
    global previous_cheating_counts

    # 현재 부정행위 카운트 가져오기
    current_counts = cheating_counts[user_id]

    # 변화 감지
    counts_changed = any(
        current_counts[key] != previous_cheating_counts[user_id][key]
        for key in current_counts
    )

    if counts_changed:
        # 부정행위 메시지 전송
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cheating_result = {
            "user_id": user_id,
            "cheating_counts": cheating_counts[user_id],
            "timestamp": current_time,
            "messages": cheating_messages[user_id]
        }
        try:
            # 백엔드에 결과 전송
            await get_cheating_result(user_id)
            # 웹소켓으로 프론트엔드에 전송
            await manager.send_message(user_id, cheating_result)

            # 이전 카운트를 업데이트
            previous_cheating_counts[user_id] = current_counts.copy()
            logging.debug(f"{user_id}: 부정행위 메시지 전송 및 이전 상태 업데이트 완료")

            # 메시지 초기화
            cheating_messages[user_id].clear()

        except Exception as e:
            logging.error(f"{user_id}: 부정행위 메시지 전송 중 오류 발생: {e}")

# `update_cheating` 함수에서 호출
async def process_frame(user_id, image, frame_timestamp):
    loop = asyncio.get_event_loop()
    try:
        image_shape, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list = await loop.run_in_executor(
            executor,
            process_image,
            image
        )
        logging.debug(f"{user_id}: 프레임 처리 완료")
    except Exception as e:
        logging.error(f"{user_id}: 프레임 처리 중 오류 발생: {e}")
        return

    # 부정행위 업데이트
    try:
        update_cheating(user_id, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list,
                        image_shape)
        logging.debug(f"{user_id}: 부정행위 업데이트 완료")

        # 변경된 경우에만 전송
        await send_cheating_result_if_changed(user_id)

    except Exception as e:
        logging.error(f"{user_id}: 부정행위 업데이트 중 오류 발생: {e}")

def process_image(image):
    """
    이미지를 처리하여 부정행위 탐지에 필요한 정보를 반환
    """
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

    return image_shape, detections, face_present, head_pose, gaze_point, hand_landmarks_list
# def update_cheating(user_id, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list,
#                     image_shape):
#     """
#     감지된 정보를 기반으로 부정행위를 업데이트
#
#     Args:
#         user_id (str): 사용자 ID.
#         detections (list): 감지된 객체의 리스트.
#         face_present (bool): 얼굴 존재 여부.
#         head_pose (dict): 머리 자세 (pitch, yaw, roll).
#         eye_center (tuple): 눈동자의 중심 좌표 (x, y).
#         gaze_point (tuple): 시선 위치의 좌표 (x, y).
#         hand_landmarks_list (list): 손 랜드마크 리스트.
#         image_shape (tuple): 이미지의 형태 (높이, 너비, 채널).
#     """
#     detect_object_presence(user_id, detections, cheating_flags, cheating_counts, cheating_messages, image_shape)
#     detect_face_absence(user_id, face_present, start_times, cheating_flags, cheating_counts, face_absence_history,
#                         cheating_messages)
#     if head_pose:
#         pitch = head_pose['pitch']
#         yaw = head_pose['yaw']
#         detect_look_around(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages)
#         detect_head_turn(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history,
#                          cheating_messages)
#         detect_eye_movement(user_id, eye_center, image_shape, start_times, cheating_flags, cheating_counts,
#                             cheating_messages)
#         if gaze_point:
#             grid_row = int(gaze_point[1] / (image_shape[0] / GRID_ROWS))
#             grid_col = int(gaze_point[0] / (image_shape[1] / GRID_COLS))
#             grid_position = (grid_row, grid_col)
#             detect_repeated_gaze(user_id, grid_position, gaze_history, start_times, cheating_flags, cheating_counts,
#                                  cheating_messages, pitch)
#     if hand_landmarks_list:
#         detect_hand_gestures(user_id, hand_landmarks_list, start_times, cheating_flags, cheating_counts,
#                              cheating_messages)
def update_cheating(user_id, exam_id, detections, face_present, head_pose, eye_center, gaze_point, hand_landmarks_list, image_shape):
    # Fetch cheating settings for the current exam
    cheating_settings = cheating_settings_cache.get(exam_id, {})

    # 동적으로 탐지 로직 활성화
    if cheating_settings.get('object'):
        detect_object_presence(user_id, detections, cheating_flags, cheating_counts, cheating_messages, image_shape)
    if cheating_settings.get('face_absence_long') or cheating_settings.get('face_absence_repeat'):
        detect_face_absence(user_id, face_present, start_times, cheating_flags, cheating_counts, face_absence_history,
                            cheating_messages)
    if head_pose:
        pitch = head_pose['pitch']
        yaw = head_pose['yaw']
        if cheating_settings.get('look_around'):
            detect_look_around(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages)
        if cheating_settings.get('head_turn_long') or cheating_settings.get('head_turn_repeat'):
            detect_head_turn(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history,
                             cheating_messages)
        if gaze_point and cheating_settings.get('repeated_gaze'):
            grid_row = int(gaze_point[1] / (image_shape[0] / GRID_ROWS))
            grid_col = int(gaze_point[0] / (image_shape[1] / GRID_COLS))
            grid_position = (grid_row, grid_col)
            detect_repeated_gaze(user_id, grid_position, gaze_history, start_times, cheating_flags, cheating_counts,
                                 cheating_messages, pitch)
    if cheating_settings.get('hand_gesture'):
        detect_hand_gestures(user_id, hand_landmarks_list, start_times, cheating_flags, cheating_counts,
                             cheating_messages)