import requests
import os
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

def transcribe_audio(audio_file_path: str) -> str:
    """Transcribe audio file using ElevenLabs STT API"""
    url = "https://api.elevenlabs.io/v1/speech-to-text"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }

    with open(audio_file_path, "rb") as audio_file:
        files = {"file": audio_file}
        response = requests.post(url, headers=headers, files=files)

    if response.status_code != 200:
        raise Exception(f"ElevenLabs transcription failed: {response.text}")

    return response.json().get("text", "")