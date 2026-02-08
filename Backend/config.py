"""Application configuration.

This module reads environment variables but performs no heavy side-effects
at import time (no DB connections, no prints of secrets).
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API key (may be empty in dev; do NOT log this value)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")


class Config:
    """Base configuration values."""
    FLASK_ENV = os.environ.get("FLASK_ENV", "development")
    FLASK_DEBUG = os.environ.get("FLASK_DEBUG", "True")
    PORT = int(os.environ.get("PORT", 8000))
    HOST = os.environ.get("HOST", "localhost")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


# CORS origins (frontend URLs)
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:5000",
]