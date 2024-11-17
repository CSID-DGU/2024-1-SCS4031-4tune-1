# app/main.py
from fastapi import FastAPI
from app.api.endpoints import gaze

app = FastAPI(
    title="Gaze Tracking API",
    description="API for gaze tracking using MediaPipe",
    version="1.0.0"
)

app.include_router(gaze.router, prefix="/api/v1")