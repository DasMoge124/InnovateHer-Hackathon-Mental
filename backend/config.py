import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    FLASK_ENV = os.environ.get("FLASK_ENV", "development")
    FLASK_DEBUG = os.environ.get("FLASK_DEBUG", True)
    PORT = int(os.environ.get("PORT", 5000))
    HOST = os.environ.get("HOST", "localhost")

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Gemini Configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# CORS Configuration
CORS_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:5174",  # Vite fallback port (if 5173 in use)
    "http://localhost:3000",
    "http://localhost:5000",
]
