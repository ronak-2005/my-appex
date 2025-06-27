from flask import Blueprint, request, jsonify
from database import chats_collection
from datetime import datetime
import uuid

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
def create_chat():
    data = request.json

    if not data.get("user_id") or not data.get("skills") or not data.get("goals"):
        return jsonify({"error": "Missing required fields"}), 400

    chat_id = str(uuid.uuid4())
    new_chat = {
        "_id": chat_id,
        "user_id": data.get("user_id"),
        "title": data.get("title", "New Chat"),
        "archived": False,
        "created_at": datetime.utcnow(),
        "messages": [
            {
                "role": "user",
                "text": f"Skills: {', '.join(data['skills'])}, Goal: {data['goals']}",
                "timestamp": datetime.utcnow()
            }
        ]
    }

    chats_collection.insert_one(new_chat)
    return jsonify({ "chat_id": chat_id }), 201


@chat_bp.route('/api/chat/<chat_id>', methods=['GET'])
def get_chat(chat_id):
    chat = chats_collection.find_one({"_id": chat_id})
    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    chat["_id"] = str(chat["_id"])
    chat["created_at"] = chat["created_at"].isoformat()
    for msg in chat.get("messages", []):
        msg["timestamp"] = msg["timestamp"].isoformat()

    return jsonify(chat)
