from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import google.generativeai as genai

from config import GEMINI_API_KEY
from prompts import build_gemini_prompt

router = APIRouter(prefix="/mental-planner", tags=["Mental Planner"])

# Configure Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class CalendarEvent(BaseModel):
    title: str
    start: str
    end: str

class ScheduleRequest(BaseModel):
    start_date: str
    end_date: str
    preferences: str
    calendar_events: Optional[List[CalendarEvent]] = []
    burnout_level: float

@router.post("/generate-schedule")
async def generate_schedule(request: ScheduleRequest):
    try:
        if not (1 <= request.burnout_level <= 5):
            raise HTTPException(status_code=400, detail="Burnout level must be 1-5")

        events = [
            {"title": e.title, "start": e.start, "end": e.end}
            for e in request.calendar_events or []
        ]

        prompt = build_gemini_prompt(
            start_date=request.start_date,
            end_date=request.end_date,
            preferences_text=request.preferences,
            calendar_events=events,
            burnout_level=request.burnout_level
        )

        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")

        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Remove markdown formatting if present
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        schedule = json.loads(text)
        return {"success": True, "schedule": schedule}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON from Gemini: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
