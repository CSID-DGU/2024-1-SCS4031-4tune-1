# detectors.py

import time
from constants import *
from custom_utils import recognize_hand_gesture

def detect_look_around(pitch, yaw, start_times, cheating_flags, cheating_counts):
    current_time = time.time()
    if pitch <= PITCH_DOWN_THRESHOLD and abs(yaw) > YAW_FORWARD_THRESHOLD:
        if start_times['look_around'] is None:
            start_times['look_around'] = current_time
        else:
            elapsed_time = current_time - start_times['look_around']
            if elapsed_time >= LOOK_AROUND_THRESHOLD and not cheating_flags['look_around']:
                cheating_flags['look_around'] = True
                cheating_counts['look_around'] += 1
                print(f'부정행위 감지! 유형: 주변 응시, 횟수: {cheating_counts["look_around"]}')
    else:
        start_times['look_around'] = None
        cheating_flags['look_around'] = False

def detect_repeated_gaze(grid_position, gaze_history, start_times, cheating_flags, cheating_counts, pitch):
    current_time = time.time()
    if pitch <= PITCH_DOWN_THRESHOLD:
        gaze_history.append((grid_position, current_time))
        # 30초 이내의 기록만 유지
        gaze_history[:] = [(pos, t) for pos, t in gaze_history if current_time - t <= REPEATED_GAZE_WINDOW]

        # 특정 위치에서 3초 이상 응시한 횟수 카운트
        position_times = {}
        for pos, t in gaze_history:
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
                    break  # 해당 위치에서 한 번만 카운트

        if repeated_gaze_count >= REPEATED_GAZE_COUNT and not cheating_flags['repeated_gaze']:
            cheating_flags['repeated_gaze'] = True
            cheating_counts['repeated_gaze'] += 1
            print(f'부정행위 감지! 유형: 동일 위치 반복 응시, 횟수: {cheating_counts["repeated_gaze"]}')
    else:
        # 아래를 보고 있는 경우 시선 기록하지 않음
        pass

def detect_object_presence(detections, cheating_flags, cheating_counts):
    cheating_objects_detected = [d for d in detections if d['name'] in CHEATING_OBJECTS]
    if cheating_objects_detected and not cheating_flags['object']:
        cheating_flags['object'] = True
        cheating_counts['object'] += 1
        objects = [d['name'] for d in cheating_objects_detected]
        print(f'부정행위 감지! 유형: 부정행위 물체 감지 ({objects}), 횟수: {cheating_counts["object"]}')
    elif not cheating_objects_detected:
        cheating_flags['object'] = False

def detect_face_absence(face_present, start_times, cheating_flags, cheating_counts, face_absence_history):
    current_time = time.time()
    if not face_present:
        if start_times['face_absence'] is None:
            start_times['face_absence'] = current_time
        else:
            elapsed_time = current_time - start_times['face_absence']
            if elapsed_time >= FACE_ABSENCE_THRESHOLD and not cheating_flags['face_absence_long']:
                cheating_flags['face_absence_long'] = True
                cheating_counts['face_absence_long'] += 1
                print(f'부정행위 감지! 유형: 장기 화면 이탈, 횟수: {cheating_counts["face_absence_long"]}')
            elif elapsed_time >= FACE_ABSENCE_DURATION:
                # 3초 이상 이탈한 경우 기록
                face_absence_history.append(current_time)
                # 30초 이내의 기록만 유지
                face_absence_history[:] = [t for t in face_absence_history if current_time - t <= FACE_ABSENCE_WINDOW]
                if len(face_absence_history) >= FACE_ABSENCE_COUNT_THRESHOLD and not cheating_flags['face_absence_repeat']:
                    cheating_flags['face_absence_repeat'] = True
                    cheating_counts['face_absence_repeat'] += 1
                    print(f'부정행위 감지! 유형: 반복 화면 이탈, 횟수: {cheating_counts["face_absence_repeat"]}')
    else:
        start_times['face_absence'] = None
        cheating_flags['face_absence_long'] = False

def detect_hand_gestures(hand_landmarks_list, start_times, cheating_flags, cheating_counts):
    current_time = time.time()
    for hand_landmarks in hand_landmarks_list:
        gesture = recognize_hand_gesture(hand_landmarks)
        if gesture == 'other':
            if start_times['hand_gesture'] is None:
                start_times['hand_gesture'] = current_time
            else:
                elapsed_time = current_time - start_times['hand_gesture']
                if elapsed_time >= HAND_GESTURE_THRESHOLD and not cheating_flags['hand_gesture']:
                    cheating_flags['hand_gesture'] = True
                    cheating_counts['hand_gesture'] += 1
                    print(f'부정행위 감지! 유형: 특정 손동작 반복, 횟수: {cheating_counts["hand_gesture"]}')
        else:
            start_times['hand_gesture'] = None
            cheating_flags['hand_gesture'] = False

def detect_head_turn(pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history):
    current_time = time.time()
    if pitch <= PITCH_DOWN_THRESHOLD and abs(yaw) > HEAD_TURN_THRESHOLD:
        if start_times['head_turn'] is None:
            start_times['head_turn'] = current_time
        else:
            elapsed_time = current_time - start_times['head_turn']
            if elapsed_time >= HEAD_TURN_DURATION and not cheating_flags['head_turn_long']:
                cheating_flags['head_turn_long'] = True
                cheating_counts['head_turn_long'] += 1
                print(f'부정행위 감지! 유형: 고개 돌림 유지, 횟수: {cheating_counts["head_turn_long"]}')
            elif elapsed_time >= HEAD_TURN_REPEAT_DURATION:
                # 3초 이상 고개를 돌린 경우 기록
                head_turn_history.append(current_time)
                # 30초 이내의 기록만 유지
                head_turn_history[:] = [t for t in head_turn_history if current_time - t <= HEAD_TURN_WINDOW]
                if len(head_turn_history) >= HEAD_TURN_COUNT_THRESHOLD and not cheating_flags['head_turn_repeat']:
                    cheating_flags['head_turn_repeat'] = True
                    cheating_counts['head_turn_repeat'] += 1
                    print(f'부정행위 감지! 유형: 고개 돌림 반복, 횟수: {cheating_counts["head_turn_repeat"]}')
    else:
        start_times['head_turn'] = None
        cheating_flags['head_turn_long'] = False

def detect_eye_movement(eye_center, image_shape, start_times, cheating_flags, cheating_counts):
    current_time = time.time()

    # 시선이 중앙에서 얼마나 벗어났는지 계산
    image_center = (image_shape[1] // 2, image_shape[0] // 2)
    dx = eye_center[0] - image_center[0]

    # 눈동자가 좌우로 많이 움직였는지 판단
    if abs(dx) > EYE_MOVEMENT_THRESHOLD:
        if start_times['eye_movement'] is None:
            start_times['eye_movement'] = current_time
        else:
            elapsed_time = current_time - start_times['eye_movement']
            if elapsed_time >= 2 and not cheating_flags['eye_movement']:
                cheating_flags['eye_movement'] = True
                cheating_counts['eye_movement'] += 1
                print(f'부정행위 감지! 유형: 눈동자 움직임, 횟수: {cheating_counts["eye_movement"]}')
    else:
        start_times['eye_movement'] = None
        cheating_flags['eye_movement'] = False