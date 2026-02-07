from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from app.services.elevenlabs import transcribe_voice

router = APIRouter()

# ✅ Define request schema
class AssessmentRequest(BaseModel):
    answers: Optional[Dict[str, int]] = None
    voiceNote: Optional[str] = None

@router.post("/submit")
def submit_assessment(payload: AssessmentRequest):
    try:
        transcript = ""

        if payload.voiceNote:
            transcript = transcribe_voice(payload.voiceNote)

        if payload.answers:
            transcript += " " + str(payload.answers)

        # Temporary scoring logic
        score = 78

        severity = (
            "high" if score >= 80
            else "medium" if score >= 60
            else "low"
        )

        return {
            "score": score,
            "severity": severity,
            "summary": "Assessment processed successfully.",
            "transcript": transcript.strip()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
