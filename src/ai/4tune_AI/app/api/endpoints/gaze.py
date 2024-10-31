# app/api/endpoints/gaze.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.gaze_tracking import GazeTracker
from app.schemas.gaze import GazeResponse
from app.utils.image_processing import read_image_from_bytes

router = APIRouter()

# GazeTracker 인스턴스 생성
gaze_tracker = GazeTracker()

@router.post("/gaze", response_model=GazeResponse)
async def gaze_endpoint(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    image_bytes = await file.read()
    image = read_image_from_bytes(image_bytes)
    gaze_direction = gaze_tracker.get_gaze_direction(image)
    response = GazeResponse(direction=gaze_direction)
    return response