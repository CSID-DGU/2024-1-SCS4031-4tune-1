import numpy as np
from app.models.gaze_tracking import GazeTrackingModel
from app.models.object_detection import ObjectDetectionModel
from app.utils.image_processing import decode_image

gaze_model = GazeTrackingModel()
object_model = ObjectDetectionModel()

def process_frame(image_bytes):
    image = decode_image(image_bytes)
    gaze_result = gaze_model.predict(image)
    object_result = object_model.predict(image)
    # 부정행위 여부 판단 로직
    is_cheating = determine_cheating(gaze_result, object_result)
    return {"is_cheating": is_cheating, "gaze": gaze_result, "objects": object_result}

def determine_cheating(gaze_result, object_result):
    # 부정행위 판단 로직 구현
    pass