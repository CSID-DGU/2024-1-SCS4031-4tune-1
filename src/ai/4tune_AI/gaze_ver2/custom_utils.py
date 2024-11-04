# utils.py

import cv2
import numpy as np
from PIL import ImageFont, ImageDraw, Image
import math

def draw_text_korean(image, text, position, font_size=30, font_color=(0, 0, 255)):
    # OpenCV 이미지를 PIL 이미지로 변환
    image_pil = Image.fromarray(image)
    draw = ImageDraw.Draw(image_pil)

    # 폰트 설정 (MacOS의 경우)
    font = ImageFont.truetype('/Library/Fonts/AppleGothic.ttf', font_size)
    # Windows의 경우
    # font = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', font_size)

    # 텍스트 그리기
    draw.text(position, text, font=font, fill=font_color)

    # PIL 이미지를 OpenCV 이미지로 변환
    image = np.array(image_pil)
    return image

def calculate_head_pose(landmarks, image_shape):
    # 3D 모델 포인트 설정
    model_points = np.array([
        (0.0, 0.0, 0.0),             # 코 끝
        (0.0, -330.0, -65.0),        # 턱 끝
        (-225.0, 170.0, -135.0),     # 왼쪽 눈 좌측 끝
        (225.0, 170.0, -135.0),      # 오른쪽 눈 우측 끝
        (-150.0, -150.0, -125.0),    # 입 좌측 끝
        (150.0, -150.0, -125.0)      # 입 우측 끝
    ])

    image_points = np.array([
        (landmarks[1][0], landmarks[1][1]),    # 코 끝
        (landmarks[152][0], landmarks[152][1]),  # 턱 끝
        (landmarks[33][0], landmarks[33][1]),   # 왼쪽 눈 좌측 끝
        (landmarks[263][0], landmarks[263][1]),  # 오른쪽 눈 우측 끝
        (landmarks[61][0], landmarks[61][1]),   # 입 좌측 끝
        (landmarks[291][0], landmarks[291][1])  # 입 우측 끝
    ], dtype='double')

    # 카메라 매트릭스 설정
    focal_length = image_shape[1]
    center = (image_shape[1] / 2, image_shape[0] / 2)
    camera_matrix = np.array(
        [[focal_length, 0, center[0]],
         [0, focal_length, center[1]],
         [0, 0, 1]], dtype='double')

    dist_coeffs = np.zeros((4, 1))  # 왜곡 계수는 0으로 설정

    # SolvePnP를 사용하여 회전 및 변환 벡터 계산
    success, rotation_vector, translation_vector = cv2.solvePnP(
        model_points, image_points, camera_matrix, dist_coeffs)

    # 회전 벡터를 오일러 각도로 변환
    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
    pose_matrix = cv2.hconcat((rotation_matrix, translation_vector))
    _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(pose_matrix)

    pitch, yaw, roll = [angle[0] for angle in euler_angles]

    return pitch, yaw, roll

def get_landmarks(face_landmarks, image_shape):
    h, w = image_shape[:2]
    landmarks = {}
    for idx, lm in enumerate(face_landmarks.landmark):
        x, y = int(lm.x * w), int(lm.y * h)
        landmarks[idx] = (x, y)
    return landmarks

def get_gaze_position(landmarks):
    # 눈 중심 계산
    left_eye = landmarks[468]
    right_eye = landmarks[473]
    gaze_point = ((left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)
    return gaze_point

def calculate_eye_position(landmarks):
    # 왼쪽 눈의 랜드마크 인덱스
    left_eye_indices = [33, 133]
    right_eye_indices = [362, 263]

    left_eye = np.mean([landmarks[idx] for idx in left_eye_indices], axis=0).astype(int)
    right_eye = np.mean([landmarks[idx] for idx in right_eye_indices], axis=0).astype(int)

    # 두 눈의 중심 계산
    eye_center = ((left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)

    return eye_center


def recognize_hand_gesture(hand_landmarks):
    # 손가락의 각 관절 랜드마크 인덱스
    finger_tips = [4, 8, 12, 16, 20]    # 엄지, 검지, 중지, 약지, 새끼 손가락 끝
    finger_pips = [2, 6, 10, 14, 18]    # 각 손가락의 PIP 관절

    finger_states = []

    for tip, pip in zip(finger_tips, finger_pips):
        tip_y = hand_landmarks.landmark[tip].y
        pip_y = hand_landmarks.landmark[pip].y

        # 손바닥이 위를 향한다고 가정 (
        if tip_y < pip_y:
            finger_states.append(1)  # 손가락이 펴져 있음
        else:
            finger_states.append(0)  # 손가락이 접혀 있음

    # 모든 손가락이 펴져 있는 경우 'palm'
    if sum(finger_states) == 5:
        return 'palm'

    # 모든 손가락이 접혀 있는 경우 'fist'
    if sum(finger_states) == 0:
        return 'fist'

    # 그 외의 경우 'other'
    return 'other'
