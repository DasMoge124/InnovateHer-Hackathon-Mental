from fastapi import UploadFile
import base64
import requests
from app.core.db_help import db 
from app.core.config import ELEVENLABS_API_KEY
from typing import Dict, Any

async def speech_to_assessment(audio_file: UploadFile, user_id: str) -> Dict[str, Any]:
    """
    Complete speech assessment pipeline:
    1. Read audio file from user upload
    2. Transcribe using ElevenLabs STT API
    3. Store assessment in MongoDB with emotional & life answers
    
    :param audio_file: Audio file uploaded by user
    :param user_id: User ID for tracking
    :return: Assessment result with transcript and assessment_id
    """
    try:
        # Read uploaded audio file
        audio_bytes = await audio_file.read()
        
        if not audio_bytes:
            raise ValueError("Audio file is empty")
        
        # Transcribe audio using ElevenLabs
        transcript = transcribe_voice(audio_bytes)
        
        # Create user if doesn't exist
        db.create_user(user_id)
        
        # Store assessment in MongoDB
        # emotional_answers: transcribed text from speech
        # life_questions: empty for now (can be filled later)
        emotional_answers = {
            "transcript": transcript,
            "source": "speech_assessment",
            "audio_filename": audio_file.filename
        }
        
        life_questions = {}
        
        assessment_id = db.store_assessment(
            user_id=user_id,
            emotional=emotional_answers,
            life=life_questions
        )
        
        return {
            "success": True,
            "assessment_id": str(assessment_id),
            "user_id": user_id,
            "transcript": transcript,
            "message": "Speech assessment stored successfully"
        }
        
    except ValueError as ve:
        raise Exception(f"Validation error: {str(ve)}")
    except Exception as e:
        raise Exception(f"Speech assessment failed: {str(e)}")


def transcribe_voice(audio_bytes: bytes) -> str:
    """
    Convert audio bytes to text using ElevenLabs Speech-to-Text API
    
    :param audio_bytes: Raw audio file bytes
    :return: Transcribed text string
    :raises Exception: If API call fails or no text returned
    """
    if not ELEVENLABS_API_KEY:
        raise Exception("Missing ELEVENLABS_API_KEY in environment variables")

    url = "https://api.elevenlabs.io/v1/speech-to-text"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
    }

    files = {
        "file": audio_bytes
    }
    data = {
        "model_id": "scribe_v1"  # or "eleven_english_v2" for English only
    }

    try:
        response = requests.post(
            url, 
            files=files, 
            data=data,
            headers=headers, 
            timeout=30
        )

        # Handle non-200 responses
        if response.status_code != 200:
            error_detail = response.text
            raise Exception(
                f"ElevenLabs API error (Status {response.status_code}): {error_detail}"
            )

        response_data = response.json()
        transcript = response_data.get("text", "").strip()
        
        if not transcript:
            raise Exception("No transcription returned from ElevenLabs API")
            
        return transcript
        
    except requests.exceptions.Timeout:
        raise Exception("ElevenLabs API request timed out (30s limit exceeded)")
    except requests.exceptions.ConnectionError as e:
        raise Exception(f"Connection error with ElevenLabs API: {str(e)}")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error with ElevenLabs: {str(e)}")
    except ValueError as je:
        raise Exception(f"Invalid JSON response from ElevenLabs: {str(je)}")