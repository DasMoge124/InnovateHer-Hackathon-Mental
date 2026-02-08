from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import sys
import os
import json

# Add parent directory to path to import db_help
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.services.elevenlabs import transcribe_audio
from app.services.scoring import calculate_burnout_score
from db_help import db

router = APIRouter()

@router.post("/submit")
async def submit_assessment(
    user_id: str = Form(...),
    answers: str = Form(...),  # JSON string
    voice_note: Optional[UploadFile] = File(None)
):
    """
    Submit burnout assessment with optional voice note
    
    - user_id: User identifier
    - answers: JSON string of assessment answers (e.g., {"q1": 3, "q2": 4, ...})
    - voice_note: Optional audio file for transcription
    """
    try:
        # Parse answers from JSON string
        answers_dict = json.loads(answers)
        
        transcript = None

        # Step 1: Transcribe voice if provided
        if voice_note:
            # Save uploaded file temporarily
            file_path = f"temp_{voice_note.filename}"
            with open(file_path, "wb") as f:
                content = await voice_note.read()
                f.write(content)
            
            # Transcribe using ElevenLabs
            transcript = transcribe_audio(file_path)
            
            # Clean up temp file
            os.remove(file_path)

        # Step 2: Calculate burnout score
        result = calculate_burnout_score(answers_dict)

        # Step 3: Save to database
        assessment_id = db.store_assessment(
            user_id=user_id,
            emotional=answers_dict,
            life={"transcript": transcript} if transcript else {}
        )

        db.store_burnout(
            user_id=user_id,
            assessment_id=assessment_id,
            score=result["score"],
            risk_level=result["severity"]
        )

        # Step 4: Return response
        return {
            "success": True,
            "assessment_id": assessment_id,
            "score": result["score"],
            "severity": result["severity"],
            "summary": result["summary"],
            "voice_transcript": transcript
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in answers field")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")