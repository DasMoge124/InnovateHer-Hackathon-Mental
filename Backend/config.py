"""
Just a checker file to check if connection is established
"""

from db_help import db
print("Collections:", db.db.list_collection_names())