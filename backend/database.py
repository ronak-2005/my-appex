from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["career_guidance_db"]  # <- explicitly name your DB

users_collection = db["users"]
chats_collection = db["chats"]