from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()
print("MONGO_URI from env:", os.getenv("MONGO_URI"))

async def test():
    client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    dbs = await client.list_database_names()
    print("MONGO_URI =", os.getenv("MONGO_URI"))
    print("Databases:", dbs)

asyncio.run(test())
