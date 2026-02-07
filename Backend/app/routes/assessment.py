from fastapi import APIRouter, HTTPException
from app.services.elevenlabs import transcribe_voice

router = APIRouter()

@router.post("/submit")
def submit_assessment(payload: dict):
    try:
        answers = payload.get("answers")
        voice_note = payload.get("voiceNote")

        transcript = ""

        if voice_note:
            transcript = transcribe_voice(voice_note)

        if answers:
            transcript += " " + str(answers)

        # TEMP scoring logic (replace later)
        score = 78

        if score >= 80:
            severity = "high"
        elif score >= 60:
            severity = "medium"
        else:
            severity = "low"

        return {
            "score": score,
            "severity": severity,
            "summary": "Assessment processed successfully.",
            "transcript": transcript.strip()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
