"""
All the helper functions that you can use to insert into the database
"""
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from datetime import datetime
from typing import Dict,Any,Tuple, List
import requests
import os
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

class InnovateHerDB:
    _instance = None
    CATEGORIES = {
        "Psychiatrist": "2084P0800X",
        "Psychologist": "103T00000X",
        "Social Worker": "1041C0700X",
        "Counselor": "101Y00000X",
        "Marriage Therapist": "106H00000X"
    }
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InnovateHerDB, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, connection_string: str = None):
        if self._initialized:
            return  
        
        self.connection_string = MONGO_URI
        self.client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
        
        self.db = self.client['InnovateHer']
        
        # All collections (connection reused)
        self.user_collection = self.db['users']
        self.assessment_collection = self.db['assessments']
        self.burnout_collection = self.db['burnout_scores']
        self.todo_collection = self.db['todo']
        self.therapist_collection = self.db['therapist_search']
        
        # Indexes (run once)
        self._setup_indexes()
        self._populate_therapists()
        self._initialized = True

    def _setup_indexes(self):
        self.assessment_collection.create_index('user_id')
        self.assessment_collection.create_index("timestamp", background=True)
        self.burnout_collection.create_index([("user_id", 1), ("date", -1)])
        self.todo_collection.create_index("user_id")
        self.therapist_collection.create_index("npi", unique=True, sparse=True)
        self.therapist_collection.create_index([("city", 1), ("category", 1)])

    def create_user(self, user_id: str):
        self.user_collection.update_one({"user_id": user_id}, 
                                      {"$set": {"user_id": user_id, "created_at": datetime.now()}}, 
                                      upsert=True)
    
    def _populate_therapists(self):
        """Populate 100 therapists per category from Indiana"""
        current_count = self.therapist_collection.count_documents({})
        if current_count >= 100:
            return
        
        # Major Indiana cities
        cities = ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", 
                  "Bloomington", "Fishers", "Hammond", "Gary", "Lafayette"]
        
        for category, taxonomy in self.CATEGORIES.items():
            count = 0
            
            for city in cities:
                if count >= 100:
                    break
                    
                url = f"https://npiregistry.cms.hhs.gov/api/?version=2.1&taxonomy_code={taxonomy}&state=IN&city={city}&limit=200"
                
                try:
                    data = requests.get(url, timeout=20).json()
                    for result in data.get("results", []):
                        if count >= 100:
                            break
                        
                        basic = result.get("basic", {})
                        addr = next((a for a in result.get("addresses", []) if a.get("address_purpose") == "LOCATION"), None)
                        if not addr:
                            continue
                        
                        doc = {
                            "category": category,
                            "npi": result.get("number"),
                            "name": f"{basic.get('first_name', '')} {basic.get('last_name', '')}".strip(),
                            "city": addr.get("city"),
                            "state": "IN",
                            "zip_code": addr.get("postal_code", "")[:5],
                            "address": addr.get("address_1"),
                            "phone": addr.get("telephone_number"),
                            "verified": True
                        }
                        if not doc['name']:
                            continue
                        
                        self.therapist_collection.update_one(
                            {"npi": doc["npi"]}, 
                            {"$set": doc}, 
                            upsert=True
                        )
                        count += 1
                except Exception as e:
                    print(f"Error fetching {category} from {city}: {e}")
                    continue
        final_count = self.therapist_collection.count_documents({})
        print(f"Total therapists: {final_count}")

            
    
    def store_assessment(self, user_id: str, emotional: Dict, life: Dict):
        """
        Docstring for store_assessment
        
        :param self: calling itself
        :param user_id: user_id
        :type user_id: str
        :param emotional: This has answers to the ranking questions, key are the questions and values are numbers
        :type emotional: Dict
        :param life: This has text after STT using eleven labs
        :type life: Dict
        """

        doc = {"user_id": user_id, "timestamp": datetime.now(), 
               "emotional_answers": emotional, "life_questions": life}
        result = self.assessment_collection.insert_one(doc)
        return str(result.inserted_id)


    
    def store_burnout(self, user_id: str, assessment_id: str, score: float, risk_level: str = None):
        """
        risk_level : using Snowflake API or LLM we determine risk level, which should be a short description of mental state
        score: contains burnout score calculate using LLM earlier
        assessment_id: needs to extracted from the previous function
        """    
        doc = {
            "user_id": user_id,
            "assessment_id": assessment_id,
            "date": datetime.now(),
            "burnout_score": round(score, 2),
            "risk_level": risk_level
        }
        self.burnout_collection.insert_one(doc)

    
    def store_todo(self, user_id: str, todos: List[Dict], burnout_score: float = 0):
        doc = {
            "user_id": user_id,
            "burnout_score": burnout_score,
            "todos": todos,
            "created_at": datetime.now()
        }
        self.todo_collection.update_one(
            {"user_id": user_id}, 
            {"$set": doc}, 
            upsert=True  # Latest todos override old
        )
    # Making getter functions
    def get_latest_burnout(self, user_id: str) -> Tuple[float, str]:
        """Get user's latest burnout score + risk level"""
        latest = self.burnout_collection.find_one(
            {"user_id": user_id}, 
            sort=[("date", -1)]
        )
        if latest:
            return latest["burnout_score"], latest["risk_level"]
        return 0.0, "low"

    def get_user_assessments(self, user_id: str, limit: int = 10) -> List[Dict]:
        return list(self.assessment_collection.find(
            {"user_id": user_id}, 
            sort=[("timestamp", -1)], 
            limit=limit
        ))

    def get_user_todos(self, user_id: str) -> List[Dict]:
        latest = self.todo_collection.find_one({"user_id": user_id}, sort=[("created_at", -1)])
        return latest["todos"] if latest else []
    
    def get_therapists(self, city: str = None, category: str = None, limit: int = 10) -> List[Dict]:
        query = {"state": "IN"}
        if city:
            query["city"] = {"$regex": city, "$options": "i"}
        if category:
            query["category"] = category
        return list(self.therapist_collection.find(query, limit=limit))
    

db = InnovateHerDB()
    



