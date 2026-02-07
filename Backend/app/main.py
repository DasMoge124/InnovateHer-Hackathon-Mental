from fastapi import FastAPI
from app.routes import assessment

app = FastAPI()

app.include_router(assessment.router, prefix="/api/assessment")

@app.get("/api/health")
def health():
    return {"status": "ok"}
