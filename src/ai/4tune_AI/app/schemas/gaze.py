# app/schemas/gaze.py
from pydantic import BaseModel

class GazeResponse(BaseModel):
    direction: str