from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from database import chats_collection
from datetime import datetime
import uuid
import logging
import jwt
from functools import wraps
import os

chat_bp = Blueprint('chat', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            token = request.cookies.get('token')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            secret_key = os.getenv('SECRET_KEY') or os.getenv('JWT_SECRET_KEY', 'your-secret-key')
            decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
            current_user = decoded_token
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def token_optional(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        current_user = None
        
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1] 
            except IndexError:
                pass
        
        if not token:
            token = request.cookies.get('token')
        
        if token:
            try:
                secret_key = os.getenv('SECRET_KEY') or os.getenv('JWT_SECRET_KEY', 'your-secret-key')
                decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
                current_user = decoded_token
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                pass
        
        return f(current_user, *args, **kwargs)
    return decorated

def validate_user_access(user_id):
    return bool(user_id)

@chat_bp.route('/api/chat', methods=['POST'])
@token_required
def create_chat(current_user): 
    print("=== CHAT ENDPOINT DEBUG ===")
    print(f"Authorization header: {request.headers.get('Authorization')}")
    print(f"Token cookie: {request.cookies.get('token')}")
    print(f"Current user: {current_user}") 
    
    try:
        data = request.json
        logging.info(f"Received chat creation request: {data}")
        
        user_id = current_user['userId'] 
        user_input = data.get("userInput", "")  # Extract userInput from request
        
        if not user_id or not user_input:
            return jsonify({"error": "Missing required fields (user_id/userId, userInput)"}), 400

        if not validate_user_access(user_id):
            return jsonify({"error": "Invalid user ID"}), 400

        chat_id = str(uuid.uuid4())
        
        # Generate a title from user input (first 50 chars)
        title = data.get("title") or user_input
        
        new_chat = {
            "_id": chat_id,
            "user_id": user_id,
            "title": title,
            "archived": False,
            "created_at": datetime.utcnow(),
            "messages": [
                {
                    "role": "assistant",
                    "text": f"Hello! I'm excited to help you with your career goals. Based on your input:\n\n{user_input}\n\nWhat would you like to explore first? I can help with career planning, skill development, job search strategies, or interview preparation.",
                    "timestamp": datetime.utcnow()
                }
            ]
        }

        result = chats_collection.insert_one(new_chat)
        logging.info(f"Chat created successfully for user {user_id}: {chat_id}")
        
        # Return both chat_id and chatId for frontend compatibility
        return jsonify({
            "success": True,
            "chat_id": chat_id,
            "chatId": chat_id,  # For frontend compatibility
            "_id": chat_id,     # Also include _id for consistency
            "message": "Chat created successfully"
        }), 201
        
    except Exception as e:
        logging.error(f"Error creating chat: {str(e)}")
        return jsonify({"error": f"Failed to create chat: {str(e)}"}), 500

@chat_bp.route('/api/chat/<chat_id>', methods=['GET'])
@token_required
def get_chat(current_user, chat_id):
    try:
        user_id = current_user['userId']
   
        query = {"_id": chat_id, "user_id": user_id}
        
        chat = chats_collection.find_one(query)
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404

        formatted_chat = {
            "_id": str(chat["_id"]),
            "userId": chat.get("user_id"), 
            "title": chat.get("title", "Untitled Chat"),
            "archived": chat.get("archived", False),
            "createdAt": chat["created_at"].isoformat(),
            "messages": [
                {
                    "role": msg.get("role", "user"),
                    "content": msg.get("text", ""),
                    "timestamp": msg["timestamp"].isoformat()
                } for msg in chat.get("messages", [])
            ]
        }
        return jsonify(formatted_chat)
    
    except Exception as e:
        logging.error(f"Error fetching chat {chat_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch chat"}), 500

@chat_bp.route('/api/chat/<chat_id>/message', methods=['POST'])
@token_required
def add_message(current_user, chat_id):
    """Add a new message to the chat"""
    try:
        data = request.json
        user_id = current_user['userId']
        
        if not data.get("message"):
            return jsonify({"error": "Message content is required"}), 400
        
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        user_message = {
            "role": "user",
            "text": data.get("message"),
            "timestamp": datetime.utcnow()
        }
        
        chats_collection.update_one(
            {"_id": chat_id},
            {"$push": {"messages": user_message}}
        )
        
        ai_response = {
            "role": "assistant",
            "text": f"Thanks for your message: '{data.get('message')}'. Let's discuss how that fits into your career journey.",
            "timestamp": datetime.utcnow()
        }
 
        chats_collection.update_one(
            {"_id": chat_id},
            {"$push": {"messages": ai_response}}
        )
        
        return jsonify({
            "success": True,
            "user_message": {
                "role": "user",
                "content": user_message["text"],
                "timestamp": user_message["timestamp"].isoformat()
            },
            "ai_response": {
                "role": "assistant", 
                "content": ai_response["text"],
                "timestamp": ai_response["timestamp"].isoformat()
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Error adding message to chat {chat_id}: {str(e)}")
        return jsonify({"error": "Failed to add message"}), 500

@chat_bp.route('/api/chat/<chat_id>/archive', methods=['PUT'])
@token_required
def archive_chat(current_user, chat_id):
    """Archive or unarchive a chat"""
    try:
        data = request.json
        user_id = current_user['userId']
        
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        archived = data.get("archived", True)
        
        result = chats_collection.update_one(
            {"_id": chat_id, "user_id": user_id},
            {"$set": {"archived": archived}}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Failed to update chat"}), 500
        
        return jsonify({
            "success": True,
            "message": f"Chat {'archived' if archived else 'unarchived'} successfully",
            "archived": archived
        }), 200
        
    except Exception as e:
        logging.error(f"Error archiving chat {chat_id}: {str(e)}")
        return jsonify({"error": "Failed to archive chat"}), 500

@chat_bp.route('/api/chat/<chat_id>/title', methods=['PUT'])
@token_required
def update_chat_title(current_user, chat_id):
    """Update chat title"""
    try:
        data = request.json
        user_id = current_user['userId']
        
        new_title = data.get("title")
        if not new_title:
            return jsonify({"error": "Title is required"}), 400
        
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        result = chats_collection.update_one(
            {"_id": chat_id, "user_id": user_id},
            {"$set": {"title": new_title}}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Failed to update chat title"}), 500
        
        return jsonify({
            "success": True,
            "message": "Chat title updated successfully",
            "title": new_title
        }), 200
        
    except Exception as e:
        logging.error(f"Error updating chat title {chat_id}: {str(e)}")
        return jsonify({"error": "Failed to update chat title"}), 500

@chat_bp.route('/api/chats', methods=['GET'])
@token_required
def get_user_chats(current_user):
    try:
        user_id = current_user['userId']
   
        archived = request.args.get('archived', '').lower() == 'true'
        limit = int(request.args.get('limit', 20))
        skip = int(request.args.get('skip', 0))
        
        query = {"user_id": user_id, "archived": archived}
        
        chats = list(chats_collection.find(query)
                    .sort("created_at", -1)
                    .skip(skip)
                    .limit(limit))

        total_count = chats_collection.count_documents(query)

        formatted_chats = []
        for chat in chats:
            formatted_chat = {
                "_id": str(chat["_id"]),
                "userId": chat.get("user_id"),
                "title": chat.get("title", "Untitled Chat"),
                "archived": chat.get("archived", False),
                "createdAt": chat["created_at"].isoformat(),
                "message_count": len(chat.get("messages", []))
            }
            formatted_chats.append(formatted_chat)
        
        return jsonify({
            "success": True,
            "chats": formatted_chats,
            "total": total_count,
            "has_more": (skip + limit) < total_count
        }), 200
        
    except Exception as e:
        logging.error(f"Error fetching user chats: {str(e)}")
        return jsonify({"error": "Failed to fetch chats"}), 500

@chat_bp.route('/api/chat/<chat_id>', methods=['DELETE'])
@token_required
def delete_chat(current_user, chat_id):
    try:
        user_id = current_user['userId']
    
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
     
        result = chats_collection.delete_one({"_id": chat_id, "user_id": user_id})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Failed to delete chat"}), 500
        
        logging.info(f"Chat {chat_id} deleted by user {user_id}")
        
        return jsonify({
            "success": True,
            "message": "Chat deleted successfully"
        }), 200
        
    except Exception as e:
        logging.error(f"Error deleting chat {chat_id}: {str(e)}")
        return jsonify({"error": "Failed to delete chat"}), 500