import cv2
import numpy as np

def calculate_head_pose(landmarks, image_shape):
    model_points = np.array([
        (0.0, 0.0, 0.0),             # 코 끝
        (0.0, -330.0, -65.0),        # 턱 끝
        (-225.0, 170.0, -135.0),     # 왼쪽 눈 좌측 끝
        (225.0, 170.0, -135.0),      # 오른쪽 눈 우측 끝
        (-150.0, -150.0, -125.0),    # 입 좌측 끝
        (150.0, -150.0, -125.0)      # 입 우측 끝
    ])

    image_points = np.array([
        (landmarks[1][0], landmarks[1][1]),
        (landmarks[152][0], landmarks[152][1]),
        (landmarks[33][0], landmarks[33][1]),
        (landmarks[263][0], landmarks[263][1]),
        (landmarks[61][0], landmarks[61][1]),
        (landmarks[291][0], landmarks[291][1])
    ], dtype='double')

    focal_length = image_shape[1]
    center = (image_shape[1] / 2, image_shape[0] / 2)
    camera_matrix = np.array(
        [[focal_length, 0, center[0]],
         [0, focal_length, center[1]],
         [0, 0, 1]], dtype='double'
    )

    dist_coeffs = np.zeros((4, 1))

    success, rotation_vector, translation_vector = cv2.solvePnP(
        model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
    )

    if not success:
        return 0.0, 0.0, 0.0

    rotation_matrix, _ = cv2.Rodrigues(rotation_vector)

    proj_matrix = np.hstack((rotation_matrix, translation_vector))
    _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(proj_matrix)

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
    left_eye = landmarks.get(468, landmarks.get(33, (0, 0)))
    right_eye = landmarks.get(473, landmarks.get(263, (0, 0)))
    gaze_point = ((left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)
    return gaze_point

def calculate_eye_position(landmarks):
    left_eye_indices = [33, 133]
    right_eye_indices = [362, 263]

    left_eye = np.mean([landmarks[idx] for idx in left_eye_indices], axis=0).astype(int)
    right_eye = np.mean([landmarks[idx] for idx in right_eye_indices], axis=0).astype(int)

    eye_center = ((left_eye[0] + right_eye[0]) // 2, (left_eye[1] + right_eye[1]) // 2)

    return eye_center

def recognize_hand_gesture(hand_landmarks):
    finger_tips = [4, 8, 12, 16, 20]
    finger_pips = [2, 6, 10, 14, 18]

    finger_states = []

    for tip, pip in zip(finger_tips, finger_pips):
        tip_y = hand_landmarks.landmark[tip].y
        pip_y = hand_landmarks.landmark[pip].y

        if tip_y < pip_y:
            finger_states.append(1)
        else:
            finger_states.append(0)

    if sum(finger_states) == 5:
        return 'palm'

    if sum(finger_states) == 0:
        return 'fist'

    return 'other'