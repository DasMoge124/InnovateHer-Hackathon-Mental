import requests
from app.core.config import ELEVENLABS_API_KEY

def transcribe_voice(audio_base64: str) -> str:
    if not ELEVENLABS_API_KEY:
        raise Exception("Missing ElevenLabs API key")

    url = "https://api.elevenlabs.io/v1/speech-to-text"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "audio": audio_base64
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception("ElevenLabs transcription failed")

    data = response.json()
    return data.get("text", "")
