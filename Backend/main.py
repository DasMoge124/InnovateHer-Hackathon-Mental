from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from json import ObjectId
from config import CORS_ORIGINS

print("🚀 Starting InnovateHer API...")

try:
    from db_help import db
    print("✅ Database connected successfully")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
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

# ============= REQUEST MODELS =============
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

# ============= HELPER FUNCTION =============
def serialize_mongo_doc(doc):
    """Convert MongoDB ObjectId to string"""
    if isinstance(doc, list):
        return [serialize_mongo_doc(item) for item in doc]
    if isinstance(doc, dict):
        return {key: str(value) if isinstance(value, ObjectId) else value 
                for key, value in doc.items()}
    return doc

# ============= ENDPOINTS =============

@app.get("/", tags=["Health Check"])
def home():
    """API health check with database status"""
    if db is None:
        return {
            "message": "InnovateHer API Running ⚠️",
            "status": "degraded",
            "database": "disconnected"
        }
    
    try:
        therapist_count = db.therapist_collection.count_documents({})
        user_count = db.user_collection.count_documents({})
        assessment_count = db.assessment_collection.count_documents({})
        
        return {
            "message": "InnovateHer API Running ✅",
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
            "message": "InnovateHer API Running ⚠️",
            "status": "degraded",
            "database": "error",
            "error": str(e)
        }

@app.post("/users/{user_id}", tags=["Users"])
def create_user(user_id: str):
    """Create a new user in the system"""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        db.create_user(user_id)
        return {"success": True, "user_id": user_id, "message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@app.post("/assessment", tags=["Assessments"])
def store_assessment(data: AssessmentRequest):
    """Store a new mental health assessment"""
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
    """Store burnout score and risk level"""
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
    """Store AI-generated todo list for user"""
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
    """Get user's latest burnout score and risk level"""
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
    """Get user's assessment history"""
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
    """Get user's latest todo list"""
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
    """
    Search for therapists in Indiana
    
    - **city**: Filter by city (e.g., Indianapolis, Fort Wayne)
    - **category**: Filter by type (Psychiatrist, Psychologist, Social Worker, Counselor, Marriage Therapist)
    - **limit**: Maximum number of results (default: 10)
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    try:
        therapists = db.get_therapists(city, category, limit)
        
        # Serialize MongoDB ObjectIds
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


        #Mental Planner
        
from mental_planner.router import router as mental_planner_router

# Register the router
app.include_router(mental_planner_router)

print("✅ FastAPI routes registered successfully")
print("📍 API will be available at http://127.0.0.1:8005")
print("📚 Interactive docs at http://127.0.0.1:8005/docs")