"""
Just a checker file to check if connection is established
"""

from app.core.db_help import db
from dotenv import load_dotenv
import os
load_dotenv()
# API Keys
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")
print("Collections:", db.db.list_collection_names())