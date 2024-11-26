import time
from constants import *
from custom_utils import *

def detect_look_around(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, cheating_messages):
    """
    주변 응시를 감지하여 부정행위로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        pitch (float): 머리의 Pitch 각도.
        yaw (float): 머리의 Yaw 각도.
        start_times (defaultdict): 부정행위 시작 시간을 기록하는 딕셔너리.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
    """
    current_time = time.time()
    # 주변 응시 조건 확인
    if pitch <= PITCH_DOWN_THRESHOLD and abs(yaw) > YAW_FORWARD_THRESHOLD:
        if start_times[user_id]['look_around'] is None:
            start_times[user_id]['look_around'] = current_time
            # print(f"[DEBUG] {user_id}: 주변 응시 시작 시간 기록: {current_time}")
        else:
            elapsed_time = current_time - start_times[user_id]['look_around']
            if elapsed_time >= LOOK_AROUND_THRESHOLD and not cheating_flags[user_id]['look_around']:
                cheating_flags[user_id]['look_around'] = True
                cheating_counts[user_id]['look_around'] += 1
                message = {'type': '주변 응시', 'start_time': current_time}
                cheating_messages[user_id].append(message)
                # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
                #       f'User: {user_id}, 유형: 주변 응시, 횟수: {cheating_counts[user_id]["look_around"]}')
    else:
        if cheating_flags[user_id]['look_around']:
            cheating_flags[user_id]['look_around'] = False
            start_times[user_id]['look_around'] = None
            # print(f"[DEBUG] {user_id}: 주변 응시 종료")

def detect_repeated_gaze(user_id, grid_position, gaze_history, start_times, cheating_flags, cheating_counts, cheating_messages, pitch):
    """
    동일 위치 반복 응시를 감지하여 부정행위로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        grid_position (tuple): 현재 시선이 위치한 그리드 좌표 (row, col).
        gaze_history (defaultdict): 시선 이력을 기록하는 딕셔너리.
        start_times (defaultdict): 부정행위 시작 시간을 기록하는 딕셔너리.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
        pitch (float): 머리의 Pitch 각도.
    """
    current_time = time.time()
    if pitch <= PITCH_DOWN_THRESHOLD:
        gaze_history[user_id].append((grid_position, current_time))
        # print(f"[DEBUG] {user_id}: 시선 위치 추가 - {grid_position} at {current_time}")
        # REPEATED_GAZE_WINDOW 내의 기록만 유지
        gaze_history[user_id] = [(pos, t) for pos, t in gaze_history[user_id] if current_time - t <= REPEATED_GAZE_WINDOW]
        # print(f"[DEBUG] {user_id}: 시선 역사 업데이트 - {gaze_history[user_id]}")

        # 특정 위치에서 REPEATED_GAZE_DURATION 이상 응시한 횟수 카운트
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
                    # print(f"[DEBUG] {user_id}: 반복 시선 감지 - 위치 {pos}, 간격 {times[i+1] - times[i]}")
                    break  # 해당 위치에서 한 번만 카운트

        # 반복 응시 조건 충족 시 부정행위 기록
        if repeated_gaze_count >= REPEATED_GAZE_COUNT and not cheating_flags[user_id]['repeated_gaze']:
            cheating_flags[user_id]['repeated_gaze'] = True
            cheating_counts[user_id]['repeated_gaze'] += 1
            message = {'type': '동일 위치 반복 응시', 'start_time': current_time}
            cheating_messages[user_id].append(message)
            # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
            #       f'User: {user_id}, 유형: 동일 위치 반복 응시, 횟수: {cheating_counts[user_id]["repeated_gaze"]}')
    else:
        if cheating_flags[user_id]['repeated_gaze']:
            cheating_flags[user_id]['repeated_gaze'] = False
            start_times[user_id]['repeated_gaze'] = None
            # print(f"[DEBUG] {user_id}: 동일 위치 반복 응시 종료")

def detect_object_presence(user_id, detections, cheating_flags, cheating_counts, cheating_messages, image_shape):
    """
    부정행위 대상 객체의 존재를 감지하여 부정행위로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        detections (list): 감지된 객체의 리스트.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
        image_shape (tuple): 이미지의 형태 (높이, 너비, 채널).
    """
    current_time = time.time()
    # 부정행위 대상 객체 감지
    cheating_objects_detected = [d for d in detections if d['name'] in CHEATING_OBJECTS]
    if cheating_objects_detected:
        if not cheating_flags[user_id]['object']:
            cheating_flags[user_id]['object'] = True
            cheating_counts[user_id]['object'] += 1
            objects = [d['name'] for d in cheating_objects_detected]
            message = {'type': '부정행위 물체 감지', 'start_time': current_time, 'objects': objects}
            cheating_messages[user_id].append(message)
            # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
            #       f'User: {user_id}, 유형: 부정행위 물체 감지 ({objects}), 횟수: {cheating_counts[user_id]["object"]}')
    else:
        if cheating_flags[user_id]['object']:
            cheating_flags[user_id]['object'] = False
            # print(f"[DEBUG] {user_id}: 부정행위 물체 감지 해제")

def detect_face_absence(user_id, face_present, start_times, cheating_flags, cheating_counts, face_absence_history, cheating_messages):
    """
    얼굴의 부재를 감지하여 장기 또는 반복적인 화면 이탈로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        face_present (bool): 얼굴 존재 여부.
        start_times (defaultdict): 부정행위 시작 시간을 기록하는 딕셔너리.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        face_absence_history (defaultdict): 얼굴 부재 이력을 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
    """
    current_time = time.time()
    if not face_present:
        if start_times[user_id]['face_absence'] is None:
            start_times[user_id]['face_absence'] = current_time
            # print(f"[DEBUG] {user_id}: 얼굴 이탈 시작 시간 기록: {current_time}")
        else:
            elapsed_time = current_time - start_times[user_id]['face_absence']
            if elapsed_time >= FACE_ABSENCE_THRESHOLD and not cheating_flags[user_id]['face_absence_long']:
                cheating_flags[user_id]['face_absence_long'] = True
                cheating_counts[user_id]['face_absence_long'] += 1
                message = {'type': '장기 화면 이탈', 'start_time': current_time}
                cheating_messages[user_id].append(message)
                # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
                #       f'User: {user_id}, 유형: 장기 화면 이탈, 횟수: {cheating_counts[user_id]["face_absence_long"]}')
            elif elapsed_time >= FACE_ABSENCE_DURATION:
                # 3초 이상 이탈한 경우 기록
                face_absence_history[user_id].append(current_time)
                # print(f"[DEBUG] {user_id}: 3초 이상 얼굴 이탈 기록: {current_time}")
                # 30초 이내의 기록만 유지
                face_absence_history[user_id] = [t for t in face_absence_history[user_id] if current_time - t <= FACE_ABSENCE_WINDOW]
                if len(face_absence_history[user_id]) >= FACE_ABSENCE_COUNT_THRESHOLD and not cheating_flags[user_id]['face_absence_repeat']:
                    cheating_flags[user_id]['face_absence_repeat'] = True
                    cheating_counts[user_id]['face_absence_repeat'] += 1
                    message = {'type': '반복 화면 이탈', 'start_time': current_time}
                    cheating_messages[user_id].append(message)
                    # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
                    #       f'User: {user_id}, 유형: 반복 화면 이탈, 횟수: {cheating_counts[user_id]["face_absence_repeat"]}')
    else:
        if cheating_flags[user_id]['face_absence_long'] or cheating_flags[user_id]['face_absence_repeat']:
            cheating_flags[user_id]['face_absence_long'] = False
            cheating_flags[user_id]['face_absence_repeat'] = False
            start_times[user_id]['face_absence'] = None
            # print(f"[DEBUG] {user_id}: 얼굴 이탈 상태 플래그 초기화")

def detect_hand_gestures(user_id, hand_landmarks_list, start_times, cheating_flags, cheating_counts, cheating_messages):
    """
    손동작을 감지하여 특정 손동작 반복을 부정행위로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        hand_landmarks_list (list): 감지된 손 랜드마크 리스트.
        start_times (defaultdict): 부정행위 시작 시간을 기록하는 딕셔너리.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
    """
    current_time = time.time()
    hand_gesture_detected = False

    for hand_landmarks in hand_landmarks_list:
        gesture = recognize_hand_gesture(hand_landmarks)
        # print(f"[DEBUG] {user_id}: 인식된 손동작 - {gesture}")
        if gesture in ['fist', 'palm']:
            hand_gesture_detected = True
            if gesture == 'fist':
                if start_times[user_id]['hand_gesture'] is None:
                    start_times[user_id]['hand_gesture'] = current_time
                    # print(f"[DEBUG] {user_id}: 손동작 'fist' 시작 시간 기록: {current_time}")
            elif gesture == 'palm':
                if cheating_flags[user_id]['hand_gesture']:
                    cheating_flags[user_id]['hand_gesture'] = False
                    start_times[user_id]['hand_gesture'] = None
                    # print(f"[DEBUG] {user_id}: 손동작 'palm' 인식, 손동작 상태 플래그 초기화")
        else:
            if start_times[user_id]['hand_gesture'] is not None:
                elapsed_time = current_time - start_times[user_id]['hand_gesture']
                # print(f"[DEBUG] {user_id}: 손동작 'other' 인식, 경과 시간: {elapsed_time}")
                if elapsed_time >= HAND_GESTURE_THRESHOLD and not cheating_flags[user_id]['hand_gesture']:
                    cheating_flags[user_id]['hand_gesture'] = True
                    cheating_counts[user_id]['hand_gesture'] += 1
                    message = {'type': '특정 손동작 반복', 'start_time': current_time}
                    cheating_messages[user_id].append(message)
                    # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
                    #       f'User: {user_id}, 부정행위 감지! 유형: 특정 손동작 반복, 횟수: {cheating_counts[user_id]["hand_gesture"]}')

    # 손동작이 감지되지 않으면 초기화
    if not hand_gesture_detected:
        if cheating_flags[user_id]['hand_gesture']:
            cheating_flags[user_id]['hand_gesture'] = False
            print(f"[DEBUG] {user_id}: 손동작 감지되지 않음, 손동작 상태 플래그 초기화")
        start_times[user_id]['hand_gesture'] = None

def detect_head_turn(user_id, pitch, yaw, start_times, cheating_flags, cheating_counts, head_turn_history, cheating_messages):
    """
    고개 돌림을 감지하여 고개 돌림 유지 및 반복을 부정행위로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        pitch (float): 머리의 Pitch 각도.
        yaw (float): 머리의 Yaw 각도.
        start_times (defaultdict): 부정행위 시작 시간을 기록하는 딕셔너리.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        head_turn_history (defaultdict): 고개 돌림 이력을 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
    """
    current_time = time.time()
    if abs(yaw) > HEAD_TURN_THRESHOLD:
        if start_times[user_id]['head_turn'] is None:
            start_times[user_id]['head_turn'] = current_time
            # print(f"[DEBUG] {user_id}: 고개 돌림 시작 시간 기록: {current_time}")
        else:
            elapsed_time = current_time - start_times[user_id]['head_turn']
            # print(f"[DEBUG] {user_id}: 고개 돌림 지속 시간: {elapsed_time}")
            if elapsed_time >= HEAD_TURN_DURATION and not cheating_flags[user_id]['head_turn_long']:
                cheating_flags[user_id]['head_turn_long'] = True
                cheating_counts[user_id]['head_turn_long'] += 1
                message = {'type': '고개 돌림 유지', 'start_time': current_time}
                cheating_messages[user_id].append(message)
                # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
                #       f'User: {user_id}, 유형: 고개 돌림 유지, 횟수: {cheating_counts[user_id]["head_turn_long"]}')
            elif elapsed_time >= HEAD_TURN_REPEAT_DURATION:
                # 3초 이상 고개를 돌린 경우 기록
                head_turn_history[user_id].append(current_time)
                # print(f"[DEBUG] {user_id}: 고개 돌림 반복 기록: {current_time}")
                # 30초 이내의 기록만 유지
                head_turn_history[user_id] = [t for t in head_turn_history[user_id] if current_time - t <= HEAD_TURN_WINDOW]
                if len(head_turn_history[user_id]) >= HEAD_TURN_COUNT_THRESHOLD and not cheating_flags[user_id]['head_turn_repeat']:
                    cheating_flags[user_id]['head_turn_repeat'] = True
                    cheating_counts[user_id]['head_turn_repeat'] += 1
                    message = {'type': '고개 돌림 반복', 'start_time': current_time}
                    cheating_messages[user_id].append(message)
                    # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))}] '
                    #       f'User: {user_id}, 유형: 고개 돌림 반복, 횟수: {cheating_counts[user_id]["head_turn_repeat"]}')
    else:
        if cheating_flags[user_id]['head_turn_long'] or cheating_flags[user_id]['head_turn_repeat']:
            cheating_flags[user_id]['head_turn_long'] = False
            cheating_flags[user_id]['head_turn_repeat'] = False
            start_times[user_id]['head_turn'] = None
            # print(f"[DEBUG] {user_id}: 고개 돌림 상태 플래그 초기화")

def detect_eye_movement(user_id, eye_center, image_shape, start_times, cheating_flags, cheating_counts, cheating_messages):
    """
    눈동자 움직임을 감지하여 부정행위로 간주합니다.

    Args:
        user_id (str): 사용자 ID.
        eye_center (tuple): 눈동자의 중심 좌표 (x, y).
        image_shape (tuple): 이미지의 형태 (높이, 너비, 채널).
        start_times (defaultdict): 부정행위 시작 시간을 기록하는 딕셔너리.
        cheating_flags (defaultdict): 부정행위 상태 플래그를 기록하는 딕셔너리.
        cheating_counts (defaultdict): 부정행위 횟수를 기록하는 딕셔너리.
        cheating_messages (defaultdict): 부정행위 메시지를 기록하는 딕셔너리.
    """
    if image_shape is None or len(image_shape) < 2:
        # print(f"[DEBUG] {user_id}: 유효하지 않은 이미지 형태")
        return

    image_center = (image_shape[1] // 2, image_shape[0] // 2)
    # print(f"[DEBUG] {user_id}: 이미지 중심 - {image_center}")

    # 눈동자 움직임 감지 로직 구현
    if eye_center:
        dx = eye_center[0] - image_center[0]
        dy = eye_center[1] - image_center[1]
        distance = math.sqrt(dx**2 + dy**2)
        # print(f"[DEBUG] {user_id}: 눈동자 이동 거리 - {distance}")

        if distance > EYE_MOVEMENT_THRESHOLD:
            if start_times[user_id]['eye_movement'] is None:
                start_times[user_id]['eye_movement'] = time.time()
                # print(f"[DEBUG] {user_id}: 눈동자 움직임 시작 시간 기록: {start_times[user_id]['eye_movement']}")
            else:
                elapsed_time = time.time() - start_times[user_id]['eye_movement']
                # print(f"[DEBUG] {user_id}: 눈동자 움직임 지속 시간: {elapsed_time}")
                if elapsed_time >= EYE_MOVEMENT_DURATION and not cheating_flags[user_id]['eye_movement']:
                    cheating_flags[user_id]['eye_movement'] = True
                    cheating_counts[user_id]['eye_movement'] += 1
                    message = {'type': '눈동자 움직임 감지됨', 'start_time': time.time()}
                    cheating_messages[user_id].append(message)
                    # print(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))}] '
                    #       f'User: {user_id}, 유형: 눈동자 움직임 감지됨, 횟수: {cheating_counts[user_id]["eye_movement"]}')
        else:
            if cheating_flags[user_id]['eye_movement']:
                cheating_flags[user_id]['eye_movement'] = False
                start_times[user_id]['eye_movement'] = None
                # print(f"[DEBUG] {user_id}: 눈동자 움직임 상태 플래그 초기화")
    else:
        if cheating_flags[user_id]['eye_movement']:
            cheating_flags[user_id]['eye_movement'] = False
            start_times[user_id]['eye_movement'] = None
            # print(f"[DEBUG] {user_id}: 눈동자 중심 없음, 눈동자 움직임 상태 플래그 초기화")