import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import math

def draw_text_korean(image, text, position, font_size=30, font_color=(0, 0, 255)):
    # OpenCV 이미지를 PIL 이미지로 변환
    image_pil = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(image_pil)

    # 폰트 설정 (한글 폰트 경로 지정 필요)
    font = ImageFont.truetype('/Library/Fonts/AppleGothic.ttf', font_size)  # MacOS의 경우
    # font = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', font_size)  # Windows의 경우

    # 텍스트 그리기
    draw.text(position, text, font=font, fill=font_color)

    # PIL 이미지를 OpenCV 이미지로 변환
    image = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
    return image

def calculate_head_pose(landmarks, image_shape):
    # 3D 모델 포인트 설정
    model_points = np.array([
        (0.0, 0.0, 0.0),             # 코 끝: 1번 랜드마크
        (0.0, -330.0, -65.0),        # 턱 끝: 152번 랜드마크
        (-225.0, 170.0, -135.0),     # 왼쪽 눈 좌측 끝: 33번 랜드마크
        (225.0, 170.0, -135.0),      # 오른쪽 눈 우측 끝: 263번 랜드마크
        (-150.0, -150.0, -125.0),    # 입 좌측 끝: 78번 랜드마크
        (150.0, -150.0, -125.0)      # 입 우측 끝: 308번 랜드마크
    ])

    image_points = np.array([
        (landmarks.landmark[1].x * image_shape[1], landmarks.landmark[1].y * image_shape[0]),    # 코 끝
        (landmarks.landmark[152].x * image_shape[1], landmarks.landmark[152].y * image_shape[0]),  # 턱 끝
        (landmarks.landmark[33].x * image_shape[1], landmarks.landmark[33].y * image_shape[0]),   # 왼쪽 눈 좌측 끝
        (landmarks.landmark[263].x * image_shape[1], landmarks.landmark[263].y * image_shape[0]),  # 오른쪽 눈 우측 끝
        (landmarks.landmark[78].x * image_shape[1], landmarks.landmark[78].y * image_shape[0]),   # 입 좌측 끝
        (landmarks.landmark[308].x * image_shape[1], landmarks.landmark[308].y * image_shape[0])  # 입 우측 끝
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

def calculate_eye_direction(landmarks, image_shape):
    # 왼쪽 및 오른쪽 눈동자 중심 계산
    h, w = image_shape[:2]

    left_eye = landmarks.landmark[468]  # 왼쪽 눈동자 중심
    right_eye = landmarks.landmark[473]  # 오른쪽 눈동자 중심

    left_eye_point = np.array([left_eye.x * w, left_eye.y * h])
    right_eye_point = np.array([right_eye.x * w, right_eye.y * h])

    # 눈동자 중심의 평균 좌표 계산
    eyes_center = (left_eye_point + right_eye_point) / 2

    # 코 끝 좌표 추출
    nose_tip = landmarks.landmark[1]
    nose_point = np.array([nose_tip.x * w, nose_tip.y * h])

    # 시선 벡터 계산
    gaze_vector = eyes_center - nose_point

    # 시선 방향 계산 (각도)
    dx = gaze_vector[0]
    dy = -gaze_vector[1]  # y축 반전

    angle = math.degrees(math.atan2(dy, dx))
    if angle < 0:
        angle += 360

    return angle

def detect_hand_gesture(hand_landmarks):
    # 손가락이 펴져 있는지 확인하여 특정 제스처를 인식
    # 엄지, 검지, 중지, 약지, 소지에 대한 랜드마크 인덱스
    finger_tips = [4, 8, 12, 16, 20]
    finger_pip = [3, 7, 11, 15, 19]

    fingers_status = []

    for tip, pip in zip(finger_tips, finger_pip):
        tip_y = hand_landmarks.landmark[tip].y
        pip_y = hand_landmarks.landmark[pip].y

        if tip_y < pip_y:
            fingers_status.append(1)  # 손가락 펴짐
        else:
            fingers_status.append(0)  # 손가락 구부러짐

    # 모든 손가락이 펴져 있으면 특정 제스처로 판단
    if sum(fingers_status) == 5:
        return True  # 부정행위 제스처 감지
    else:
        return False