from fastapi import APIRouter, UploadFile, File
from app.services.inference_service import process_frame
from app.schemas.inference import InferenceResponse

router = APIRouter()

@router.post("/inference", response_model=InferenceResponse)
async def inference_endpoint(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = process_frame(image_bytes)
    return InferenceResponse(**result)