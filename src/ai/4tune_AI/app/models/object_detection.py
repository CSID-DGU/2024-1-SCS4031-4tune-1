# app/models/gaze_tracking.py
import cv2
import mediapipe as mp
import numpy as np


class GazeTracker:
    def __init__(self):
        # MediaPipe Face Mesh 초기화
        self.face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.left_eye_indices = [33, 133]  # 왼쪽 눈 가장자리 랜드마크 인덱스
        self.right_eye_indices = [362, 263]  # 오른쪽 눈 가장자리 랜드마크 인덱스

    def get_gaze_direction(self, image):
        # 이미지 전처리
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(image_rgb)

        if results.multi_face_landmarks:
            face_landmarks = results.multi_face_landmarks[0]
            h, w, _ = image.shape

            # 눈 랜드마크 좌표 추출
            left_eye = self._get_eye_coordinates(face_landmarks, self.left_eye_indices, w, h)
            right_eye = self._get_eye_coordinates(face_landmarks, self.right_eye_indices, w, h)

            # 시선 방향 계산
            gaze_direction = self._calculate_gaze_direction(left_eye, right_eye)
            return gaze_direction
        else:
            return 'no_face_detected'

    def _get_eye_coordinates(self, face_landmarks, indices, image_width, image_height):
        coords = []
        for idx in indices:
            lm = face_landmarks.landmark[idx]
            x, y = int(lm.x * image_width), int(lm.y * image_height)
            coords.append((x, y))
        return coords

    def _calculate_gaze_direction(self, left_eye, right_eye):
        # 눈의 중심점 계산
        left_eye_center = np.mean(left_eye, axis=0)
        right_eye_center = np.mean(right_eye, axis=0)
        eye_center = (left_eye_center + right_eye_center) / 2.0

        # 얼굴 중심과의 상대적 위치로 시선 방향 판단 (간단한 예시)
        if eye_center[0] < left_eye_center[0]:
            return 'looking right'
        elif eye_center[0] > right_eye_center[0]:
            return 'looking left'
        else:
            return 'looking center'