from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import google.generativeai as genai

from config import GEMINI_API_KEY, CORS_ORIGINS
from prompts import build_gemini_prompt

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


class HealthResponse(BaseModel):
    status: str


@app.post("/api/generate-schedule")
async def generate_schedule(request: ScheduleRequest):
    """
    Endpoint to generate a wellness schedule using Gemini API.
    
    Expected JSON payload:
    {
        "start_date": "YYYY-MM-DD",
        "end_date": "YYYY-MM-DD",
        "preferences": "User's preferences text",
        "calendar_events": [],
        "burnout_level": 3.5
    }
    """
    try:
        # Validate burnout level
        if not (1 <= request.burnout_level <= 5):
            raise HTTPException(
                status_code=400,
                detail="Burnout level must be between 1 and 5"
            )
        
        # Convert calendar events to list of dicts
        calendar_events_list = [
            {
                "title": event.title,
                "start": event.start,
                "end": event.end
            }
            for event in request.calendar_events or []
        ]
        
        # Build prompt
        prompt = build_gemini_prompt(
            start_date=request.start_date,
            end_date=request.end_date,
            preferences_text=request.preferences,
            calendar_events=calendar_events_list,
            burnout_level=request.burnout_level
        )
        
        # Call Gemini API
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured"
            )
        
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        
        # Parse and validate JSON response
        response_text = response.text.strip()
        
        # Remove markdown code block if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        schedule_data = json.loads(response_text)
        
        return {
            "success": True,
            "schedule": schedule_data
        }
    
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON in Gemini response: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
