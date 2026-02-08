from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from bson import ObjectId
from fastapi import UploadFile, File, Form
import traceback


try:
    from app.core.db_help import db
    print("Database connected successfully")
except Exception as e:
    print(f"Database connection failed: {e}")
    db = None

app = FastAPI(
    title="InnovateHer Mental Health API",
    description="API for mental health assessments, burnout tracking, and therapist discovery",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssessmentRequest(BaseModel):
    user_id: str
    emotional: Dict
    life: Dict

class BurnoutRequest(BaseModel):
    user_id: str
    assessment_id: str
    score: float
    risk_level: str = None

class TodoRequest(BaseModel):
    user_id: str
    todos: List[Dict]
    burnout_score: float = 0


def serialize_mongo_doc(doc):

    if isinstance(doc, list):
        return [serialize_mongo_doc(item) for item in doc]
    if isinstance(doc, dict):
        return {key: str(value) if isinstance(value, ObjectId) else value 
                for key, value in doc.items()}
    return doc



@app.get("/", tags=["Health Check"])
def home():
    if db is None:
        return {
            "message": "InnovateHer API Running ",
            "status": "degraded",
            "database": "disconnected"
        }
    
    try:
        therapist_count = db.therapist_collection.count_documents({})
        user_count = db.user_collection.count_documents({})
        assessment_count = db.assessment_collection.count_documents({})
        
        return {
            "message": "InnovateHer API Running ",
            "status": "healthy",
            "database": "connected",
            "stats": {
                "therapists": therapist_count,
                "users": user_count,
                "assessments": assessment_count
            },
            "endpoints": {
                "docs": "/docs",
                "therapists": "/therapists",
                "users": "/users/{user_id}",
                "assessments": "/assessment",
                "burnout": "/burnout"
            }
        }
    except Exception as e:
        return {
            "message": "InnovateHer API Running ",
            "status": "degraded",
            "database": "error",
            "error": str(e)
        }

@app.post("/users/{user_id}", tags=["Users"])
def create_user(user_id: str):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        db.create_user(user_id)
        return {"success": True, "user_id": user_id, "message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@app.post("/assessment", tags=["Assessments"])
def store_assessment(data: AssessmentRequest):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        assessment_id = db.store_assessment(data.user_id, data.emotional, data.life)
        return {
            "success": True,
            "assessment_id": assessment_id,
            "message": "Assessment stored successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store assessment: {str(e)}")

@app.post("/burnout", tags=["Burnout"])
def store_burnout(data: BurnoutRequest):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        db.store_burnout(data.user_id, data.assessment_id, data.score, data.risk_level)
        return {
            "success": True,
            "burnout_score": data.score,
            "risk_level": data.risk_level,
            "message": "Burnout data stored successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store burnout: {str(e)}")

@app.post("/todos", tags=["Todos"])
def store_todos(data: TodoRequest):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        db.store_todo(data.user_id, data.todos, data.burnout_score)
        return {
            "success": True,
            "todo_count": len(data.todos),
            "message": "Todos stored successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store todos: {str(e)}")

@app.get("/burnout/{user_id}", tags=["Burnout"])
def get_burnout(user_id: str):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        score, risk = db.get_latest_burnout(user_id)
        return {
            "user_id": user_id,
            "burnout_score": score,
            "risk_level": risk,
            "message": "Low risk" if risk == "low" else "Elevated risk - consider seeking support"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch burnout: {str(e)}")

@app.get("/assessments/{user_id}", tags=["Assessments"])
def get_assessments(user_id: str, limit: int = 10):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        assessments = db.get_user_assessments(user_id, limit)
        # Serialize MongoDB documents
        assessments = serialize_mongo_doc(assessments)
        return {
            "user_id": user_id,
            "count": len(assessments),
            "assessments": assessments
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch assessments: {str(e)}")

@app.get("/todos/{user_id}", tags=["Todos"])
def get_todos(user_id: str):
    """
    gives to
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        todos = db.get_user_todos(user_id)
        return {
            "user_id": user_id,
            "count": len(todos),
            "todos": todos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch todos: {str(e)}")

@app.get("/therapists", tags=["Therapists"])
def get_therapists(city: str = None, category: str = None, limit: int = 10):

    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        therapists = db.get_therapists(city, category, limit)
        
        therapists = serialize_mongo_doc(therapists)
        
        return {
            "count": len(therapists),
            "filters": {
                "city": city,
                "category": category,
                "limit": limit
            },
            "therapists": therapists
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch therapists: {str(e)}")

@app.get("/therapist-categories", tags=["Therapists"])
def get_therapist_categories():
    """Get list of available therapist categories"""
    return {
        "categories": list(db.CATEGORIES.keys()) if db else [],
        "description": "Use these categories to filter therapist searches"
    }

@app.get("/stats", tags=["Statistics"])
def get_statistics():
    """Get overall system statistics"""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        stats = {
            "total_users": db.user_collection.count_documents({}),
            "total_assessments": db.assessment_collection.count_documents({}),
            "total_burnout_records": db.burnout_collection.count_documents({}),
            "total_therapists": db.therapist_collection.count_documents({}),
            "therapists_by_category": {}
        }
        
        # Count therapists by category
        for category in db.CATEGORIES.keys():
            count = db.therapist_collection.count_documents({"category": category})
            stats["therapists_by_category"][category] = count
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")
    
@app.post("/speech/assessment", tags=["Speech"])
async def speech_assessment(audio_file: UploadFile = File(...), user_id: str = Form(...)):
    """
    Speech Assessment Endpoint
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    if not audio_file:
        raise HTTPException(status_code=400, detail="No audio file provided")
    
    allowed_types = ["audio/mpeg", "audio/wav", "audio/mp3"]
    if audio_file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid audio format. Allowed: {', '.join(allowed_types)}"
        )
    
    if not user_id or not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    
    try:
        from app.services.elevenlabs import speech_to_assessment
        result = await speech_to_assessment(audio_file, user_id)
        return result
    except Exception as e:
        print(f"ERROR in speech_assessment: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Speech assessment failed: {str(e)}")

@app.get("/speech/{user_id}/history", tags=["Speech"])
def get_speech_history(user_id: str, limit: int = 10):
    """
    Get all speech assessments for a user
    
    Args:
        user_id: User identifier
        limit: Max number of assessments to return (default 10)
        
    Returns:
        List of speech assessments with transcripts
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        assessments = db.get_user_assessments(user_id, limit)
        assessments = serialize_mongo_doc(assessments)
        
        # Filter to show only speech assessments
        speech_assessments = [
            a for a in assessments 
            if a.get("emotional_answers", {}).get("source") == "speech_assessment"
        ]
        
        return {
            "user_id": user_id,
            "count": len(speech_assessments),
            "assessments": speech_assessments
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch speech history: {str(e)}")

