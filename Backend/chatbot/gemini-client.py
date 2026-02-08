import google.generativeai as genai
from prompts import SYSTEM_PROMPT
from config import GEMINI_API_KEY

# Configure Gemini API
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")
genai.configure(api_key=GEMINI_API_KEY)

# Choose the model
MODEL_NAME = "gemini-3-flash-preview"
model = genai.GenerativeModel(MODEL_NAME)


def generate_supportive_reply(user_message: str, conversation_history: list = None) -> str:
    """
    Generate a warm, personal, affectionate reply using Gemini.
    conversation_history: list of {"role": "user"/"bot", "text": "..."}
    """
    if conversation_history is None:
        conversation_history = []

    # Build conversation history text
    history_text = "\n".join([f"{m['role'].capitalize()}: {m['text']}" for m in conversation_history])

    # Build prompt
    prompt = f"""
System instruction:
{SYSTEM_PROMPT}

Conversation so far:
{history_text}

User says:
"{user_message}"

Write a warm, supportive, and affectionate response.
Include relevant website resources (Burnout Assessment, Therapy Finder, Wellbeing Schedule) if appropriate.
"""

    try:
        # Generate response
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Remove markdown/code blocks if present
        if response_text.startswith("```json") or response_text.startswith("```"):
            response_text = response_text.split("```")[-1].strip()

        return response_text

    except Exception as e:
        print("Gemini API failed:", e)
        return "I’m here with you, but I’m having a little trouble connecting to my helper right now 🤍"
