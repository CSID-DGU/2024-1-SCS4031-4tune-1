import time
from constants import CHEATING_THRESHOLD, HEAD_TURN_THRESHOLD, EYE_TURN_THRESHOLD

def detect_face_absence(face_present, start_times, cheating_flags, cheating_counts):
    if not face_present:
        if start_times['face'] is None:
            start_times['face'] = time.time()
        else:
            elapsed_time = time.time() - start_times['face']
            if elapsed_time >= CHEATING_THRESHOLD and not cheating_flags['face']:
                cheating_flags['face'] = True
                cheating_counts['face'] += 1
                current_time = time.strftime("%Y-%m-%d %H:%M:%S")
                print(f'부정행위 감지! 유형: 얼굴 미검출, 시간: {current_time}, 횟수: {cheating_counts["face"]}')
    else:
        start_times['face'] = None
        cheating_flags['face'] = False

def detect_head_turn(yaw, start_times, cheating_flags, cheating_counts):
    if abs(yaw) > HEAD_TURN_THRESHOLD:
        if start_times['head'] is None:
            start_times['head'] = time.time()
        else:
            elapsed_time = time.time() - start_times['head']
            if elapsed_time >= CHEATING_THRESHOLD and not cheating_flags['head']:
                cheating_flags['head'] = True
                cheating_counts['head'] += 1
                current_time = time.strftime("%Y-%m-%d %H:%M:%S")
                print(f'부정행위 감지! 유형: 고개 돌림, 시간: {current_time}, 횟수: {cheating_counts["head"]}')
    else:
        start_times['head'] = None
        cheating_flags['head'] = False

def detect_eye_movement(eye_angle, start_times, cheating_flags, cheating_counts):
    if eye_angle < (90 - EYE_TURN_THRESHOLD) or eye_angle > (90 + EYE_TURN_THRESHOLD):
        if start_times['eye'] is None:
            start_times['eye'] = time.time()
        else:
            elapsed_time = time.time() - start_times['eye']
            if elapsed_time >= CHEATING_THRESHOLD and not cheating_flags['eye']:
                cheating_flags['eye'] = True
                cheating_counts['eye'] += 1
                current_time = time.strftime("%Y-%m-%d %H:%M:%S")
                print(f'부정행위 감지! 유형: 눈동자 돌림, 시간: {current_time}, 횟수: {cheating_counts["eye"]}')
    else:
        start_times['eye'] = None
        cheating_flags['eye'] = False

def detect_hand_gesture_wrapper(hand_gesture_detected, hand_label, start_times, cheating_flags, cheating_counts):
    if hand_gesture_detected:
        if start_times['hand'].get(hand_label) is None:
            start_times['hand'][hand_label] = time.time()
        else:
            elapsed_time = time.time() - start_times['hand'][hand_label]
            if elapsed_time >= CHEATING_THRESHOLD and not cheating_flags['hand'].get(hand_label, False):
                cheating_flags['hand'][hand_label] = True
                cheating_counts['hand'][hand_label] = cheating_counts['hand'].get(hand_label, 0) + 1
                current_time = time.strftime("%Y-%m-%d %H:%M:%S")
                print(f'부정행위 감지! 유형: 손동작, 손: {hand_label}, 시간: {current_time}, 횟수: {cheating_counts["hand"][hand_label]}')
    else:
        start_times['hand'][hand_label] = None
        cheating_flags['hand'][hand_label] = False