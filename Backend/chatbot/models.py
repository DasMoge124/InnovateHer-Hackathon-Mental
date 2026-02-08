# chatbot/models.py
from pydantic import BaseModel

# Pydantic request/response models
class ChatRequest(BaseModel):
    message: str
    user_id: str

class ChatResponse(BaseModel):
    reply: str
    risk_level: str

# In-memory conversation memory
conversation_history = {}
MAX_HISTORY = 10
