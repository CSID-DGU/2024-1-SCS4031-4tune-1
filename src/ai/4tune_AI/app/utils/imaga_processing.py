# app/utils/image_processing.py
import cv2
import numpy as np

def read_image_from_bytes(image_bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return image