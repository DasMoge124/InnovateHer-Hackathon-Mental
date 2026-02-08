from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import assessment

app = FastAPI(
    title="InnovateHer Burnout Assessment API",
    description="API for burnout assessment with voice transcription",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include assessment routes
app.include_router(assessment.router, prefix="/assessment", tags=["Assessment"])

@app.get("/")
def home():
    return {
        "message": "InnovateHer Burnout Assessment API",
        "status": "running",
        "docs": "/docs"
    }