import cv2
import numpy as np
import math

def calculate_head_pose(landmarks, image_shape):
    """
    얼굴 랜드마크를 사용하여 머리의 Pitch, Yaw, Roll 각도를 계산합니다.

    Args:
        landmarks (dict): 얼굴 랜드마크 인덱스와 (x, y) 좌표의 딕셔너리.
        image_shape (tuple): 이미지의 형태 (높이, 너비, 채널).

    Returns:
        tuple: (pitch, yaw, roll) 머리의 각도.
    """
    # 3D 모델 포인트 설정 (미디에이피 얼굴 랜드마크 기준)
    model_points = np.array([
        (0.0, 0.0, 0.0),             # 코 끝
        (0.0, -330.0, -65.0),        # 턱 끝
        (-225.0, 170.0, -135.0),     # 왼쪽 눈 좌측 끝
        (225.0, 170.0, -135.0),      # 오른쪽 눈 우측 끝
        (-150.0, -150.0, -125.0),    # 입 좌측 끝
        (150.0, -150.0, -125.0)      # 입 우측 끝
    ])

    # 이미지 상의 2D 랜드마크 포인트 설정
    image_points = np.array([
        (landmarks[1][0], landmarks[1][1]),      # 코 끝
        (landmarks[152][0], landmarks[152][1]),  # 턱 끝
        (landmarks[33][0], landmarks[33][1]),    # 왼쪽 눈 좌측 끝
        (landmarks[263][0], landmarks[263][1]),  # 오른쪽 눈 우측 끝
        (landmarks[61][0], landmarks[61][1]),    # 입 좌측 끝
        (landmarks[291][0], landmarks[291][1])   # 입 우측 끝
    ], dtype='double')

    # 카메라 매트릭스 설정
    focal_length = image_shape[1]
    center = (image_shape[1] / 2, image_shape[0] / 2)
    camera_matrix = np.array(
        [[focal_length, 0, center[0]],
         [0, focal_length, center[1]],
         [0, 0, 1]], dtype='double'
    )

    # 왜곡 계수는 0으로 설정
    dist_coeffs = np.zeros((4, 1))

    # SolvePnP를 사용하여 회전 및 변환 벡터 계산
    success, rotation_vector, translation_vector = cv2.solvePnP(
        model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
    )

    if not success:
        return 0.0, 0.0, 0.0

    # 회전 벡터를 회전 행렬로 변환
    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)

    # 회전 행렬에서 오일러 각도 계산
    proj_matrix = np.hstack((rotation_matrix, translation_vector))
    _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(proj_matrix)

    pitch, yaw, roll = [angle[0] for angle in euler_angles]

    return pitch, yaw, roll

def get_landmarks(face_landmarks, image_shape):
    """
    Mediapipe 얼굴 랜드마크 객체를 이미지 좌표로 변환합니다.

    Args:
        face_landmarks (object): Mediapipe 얼굴 랜드마크 객체.
        image_shape (tuple): 이미지의 형태 (높이, 너비, 채널).

    Returns:
        dict: 랜드마크 인덱스와 (x, y) 좌표의 딕셔너리.
    """
    h, w = image_shape[:2]
    landmarks = {}
    for idx, lm in enumerate(face_landmarks.landmark):
        x, y = int(lm.x * w), int(lm.y * h)
        landmarks[idx] = (x, y)
    return landmarks

def get_gaze_position(landmarks):
    """
    얼굴 랜드마크를 기반으로 시선 위치를 추정합니다.

    Args:
        landmarks (dict): 얼굴 랜드마크 인덱스와 (x, y) 좌표의 딕셔너리.

    Returns:
        tuple: 시선 위치의 좌표 (x, y).
    """
    # 양쪽 눈의 중심 계산
    left_eye = landmarks.get(468, landmarks.get(33, (0, 0)))  # Mediapipe Face Mesh에서 양쪽 눈의 주요 랜드마크
    right_eye = landmarks.get(473, landmarks.get(263, (0, 0)))
    gaze_point = ((left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)
    return gaze_point

def calculate_eye_position(landmarks):
    """
    얼굴 랜드마크를 기반으로 눈동자의 위치를 계산합니다.

    Args:
        landmarks (dict): 얼굴 랜드마크 인덱스와 (x, y) 좌표의 딕셔너리.

    Returns:
        tuple: 눈동자의 중심 좌표 (x, y).
    """
    # 왼쪽 눈의 랜드마크 인덱스
    left_eye_indices = [33, 133]
    # 오른쪽 눈의 랜드마크 인덱스
    right_eye_indices = [362, 263]

    # 왼쪽 눈의 중앙 계산
    left_eye = np.mean([landmarks[idx] for idx in left_eye_indices], axis=0).astype(int)
    # 오른쪽 눈의 중앙 계산
    right_eye = np.mean([landmarks[idx] for idx in right_eye_indices], axis=0).astype(int)

    # 두 눈의 중심 계산
    eye_center = ((left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)

    return eye_center

def recognize_hand_gesture(hand_landmarks):
    """
    손 랜드마크를 기반으로 손동작을 인식합니다.

    Args:
        hand_landmarks (object): Mediapipe 손 랜드마크 객체.

    Returns:
        str: 인식된 손동작 ('palm', 'fist', 'other').
    """
    # 손가락의 각 관절 랜드마크 인덱스
    finger_tips = [4, 8, 12, 16, 20]    # 엄지, 검지, 중지, 약지, 새끼 손가락 끝
    finger_pips = [2, 6, 10, 14, 18]    # 각 손가락의 PIP 관절

    finger_states = []

    for tip, pip in zip(finger_tips, finger_pips):
        tip_y = hand_landmarks.landmark[tip].y
        pip_y = hand_landmarks.landmark[pip].y

        # 손바닥이 위를 향한다고 가정
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