import time
import math
from constants import *
from custom_utils import *

def record_event_with_cooldown(user_id, event_type, cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message):
    """
    쿨다운을 확인하고 부정행위 이벤트를 기록하는 헬퍼 함수.
    event_type: 'look_around', 'repeated_gaze', 'object', 'face_absence_long', 'face_absence_repeat',
                'hand_gesture', 'head_turn_long', 'head_turn_repeat'
    """
    if current_time - cooldowns[user_id][event_type] > COOLDOWN_DURATION:
        # 쿨다운 지남 -> 이벤트 기록
        cheating_counts[user_id][event_type] += 1
        cheating_messages[user_id].append(message)
        cooldowns[user_id][event_type] = current_time
    # 쿨다운 내라면 아무 것도 안 함 (카운트 증가, 메시지 없음)

def detect_look_around(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION):
    current_time = time.time()
    if pitch > PITCH_DOWN_THRESHOLD and abs(yaw) > YAW_FORWARD_THRESHOLD:
        if start_times[user_id]['look_around'] is None:
            start_times[user_id]['look_around'] = current_time
        else:
            elapsed_time = current_time - start_times[user_id]['look_around']
            if elapsed_time >= LOOK_AROUND_THRESHOLD and not cheating_flags[user_id]['look_around']:
                cheating_flags[user_id]['look_around'] = True
                message = {'type': '주변 응시', 'start_time': current_time}
                record_event_with_cooldown(user_id, 'look_around', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
    else:
        if cheating_flags[user_id]['look_around']:
            cheating_flags[user_id]['look_around'] = False
            start_times[user_id]['look_around'] = None

def detect_repeated_gaze(user_id, grid_position, gaze_history, start_times, cheating_flags, cheating_counts, cheating_messages, pitch, cooldowns, COOLDOWN_DURATION):
    current_time = time.time()
    if pitch > PITCH_DOWN_THRESHOLD:
        gaze_history[user_id].append((grid_position, current_time))
        gaze_history[user_id] = [(pos, t) for pos, t in gaze_history[user_id] if current_time - t <= REPEATED_GAZE_WINDOW]

        position_times = {}
        for pos, t in gaze_history[user_id]:
            if pos not in position_times:
                position_times[pos] = [t]
            else:
                position_times[pos].append(t)

        repeated_gaze_count = 0
        for pos, times in position_times.items():
            times.sort()
            for i in range(len(times) - 1):
                if times[i+1] - times[i] <= REPEATED_GAZE_DURATION:
                    repeated_gaze_count += 1
                    break

        if repeated_gaze_count >= REPEATED_GAZE_COUNT and not cheating_flags[user_id]['repeated_gaze']:
            cheating_flags[user_id]['repeated_gaze'] = True
            message = {'type': '동일 위치 반복 응시', 'start_time': current_time}
            record_event_with_cooldown(user_id, 'repeated_gaze', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
    else:
        if cheating_flags[user_id]['repeated_gaze']:
            cheating_flags[user_id]['repeated_gaze'] = False
            start_times[user_id]['repeated_gaze'] = None

def detect_object_presence(user_id, detections, cheating_flags, cheating_counts, cheating_messages, image_shape, cooldowns, COOLDOWN_DURATION):
    current_time = time.time()
    cheating_objects_detected = [d for d in detections if d['name'] in CHEATING_OBJECTS]
    if cheating_objects_detected:
        if not cheating_flags[user_id]['object']:
            cheating_flags[user_id]['object'] = True
            objects = [d['name'] for d in cheating_objects_detected]
            message = {'type': '부정행위 물체 감지', 'start_time': current_time, 'objects': objects}
            record_event_with_cooldown(user_id, 'object', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
    else:
        if cheating_flags[user_id]['object']:
            cheating_flags[user_id]['object'] = False

def detect_face_absence(user_id, face_present, start_times, cheating_flags, cheating_counts, face_absence_history, cheating_messages, cooldowns, COOLDOWN_DURATION):
    current_time = time.time()
    if not face_present:
        if start_times[user_id]['face_absence'] is None:
            start_times[user_id]['face_absence'] = current_time
        else:
            elapsed_time = current_time - start_times[user_id]['face_absence']
            if elapsed_time >= FACE_ABSENCE_THRESHOLD and not cheating_flags[user_id]['face_absence_long']:
                cheating_flags[user_id]['face_absence_long'] = True
                message = {'type': '장기 화면 이탈', 'start_time': current_time}
                record_event_with_cooldown(user_id, 'face_absence_long', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
            elif elapsed_time >= FACE_ABSENCE_DURATION:
                face_absence_history[user_id].append(current_time)
                face_absence_history[user_id] = [t for t in face_absence_history[user_id] if current_time - t <= FACE_ABSENCE_WINDOW]
                if len(face_absence_history[user_id]) >= FACE_ABSENCE_COUNT_THRESHOLD and not cheating_flags[user_id]['face_absence_repeat']:
                    cheating_flags[user_id]['face_absence_repeat'] = True
                    message = {'type': '반복 화면 이탈', 'start_time': current_time}
                    record_event_with_cooldown(user_id, 'face_absence_repeat', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
    else:
        if cheating_flags[user_id]['face_absence_long'] or cheating_flags[user_id]['face_absence_repeat']:
            cheating_flags[user_id]['face_absence_long'] = False
            cheating_flags[user_id]['face_absence_repeat'] = False
            start_times[user_id]['face_absence'] = None

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

def detect_hand_gestures(user_id, hand_landmarks_list, start_times, cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION):
    current_time = time.time()
    hand_gesture_detected = False

    for hand_landmarks in hand_landmarks_list:
        gesture = recognize_hand_gesture(hand_landmarks)
        if gesture in HAND_GESTURE_EXCLUDE:
            hand_gesture_detected = True
            if start_times[user_id]['hand_gesture'] is None:
                start_times[user_id]['hand_gesture'] = current_time
        else:
            if start_times[user_id]['hand_gesture'] is not None:
                elapsed_time = current_time - start_times[user_id]['hand_gesture']
                if elapsed_time >= HAND_GESTURE_THRESHOLD and not cheating_flags[user_id]['hand_gesture']:
                    cheating_flags[user_id]['hand_gesture'] = True
                    message = {'type': '특정 손동작 반복', 'start_time': current_time}
                    record_event_with_cooldown(user_id, 'hand_gesture', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)

    if not hand_gesture_detected:
        if cheating_flags[user_id]['hand_gesture']:
            cheating_flags[user_id]['hand_gesture'] = False
        start_times[user_id]['hand_gesture'] = None

def detect_head_turn(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history, cheating_messages, cooldowns, COOLDOWN_DURATION):
    current_time = time.time()
    if abs(yaw) > HEAD_TURN_THRESHOLD:
        if start_times[user_id]['head_turn'] is None:
            start_times[user_id]['head_turn'] = current_time
        else:
            elapsed_time = current_time - start_times[user_id]['head_turn']
            if elapsed_time >= HEAD_TURN_DURATION and not cheating_flags[user_id]['head_turn_long']:
                cheating_flags[user_id]['head_turn_long'] = True
                message = {'type': '고개 돌림 유지', 'start_time': current_time}
                record_event_with_cooldown(user_id, 'head_turn_long', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
            elif elapsed_time >= HEAD_TURN_REPEAT_DURATION:
                head_turn_history[user_id].append(current_time)
                head_turn_history[user_id] = [t for t in head_turn_history[user_id] if current_time - t <= HEAD_TURN_WINDOW]
                if len(head_turn_history[user_id]) >= HEAD_TURN_COUNT_THRESHOLD and not cheating_flags[user_id]['head_turn_repeat']:
                    cheating_flags[user_id]['head_turn_repeat'] = True
                    message = {'type': '고개 돌림 반복', 'start_time': current_time}
                    record_event_with_cooldown(user_id, 'head_turn_repeat', cheating_flags, cheating_counts, cheating_messages, cooldowns, COOLDOWN_DURATION, current_time, message)
    else:
        if cheating_flags[user_id]['head_turn_long'] or cheating_flags[user_id]['head_turn_repeat']:
            cheating_flags[user_id]['head_turn_long'] = False
            cheating_flags[user_id]['head_turn_repeat'] = False
            start_times[user_id]['head_turn'] = None