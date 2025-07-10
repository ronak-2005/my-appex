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
        
        # First try to get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        # If no token in header, try to get from cookie
        if not token:
            token = request.cookies.get('token')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Use the same secret key as your verify-token endpoint
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
    """Optional token decorator - extracts user if token exists, otherwise passes None"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        current_user = None
        
        # First try to get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                pass
        
        # If no token in header, try to get from cookie
        if not token:
            token = request.cookies.get('token')
        
        if token:
            try:
                secret_key = os.getenv('SECRET_KEY') or os.getenv('JWT_SECRET_KEY', 'your-secret-key')
                decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
                current_user = decoded_token
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                # Token is invalid but we allow the request to continue
                pass
        
        return f(current_user, *args, **kwargs)
    return decorated

def validate_user_access(user_id):
    """Validate user access - implement your validation logic here"""
    # Add your user validation logic here
    # For now, just return True if user_id exists
    return bool(user_id)

@chat_bp.route('/api/chat', methods=['POST'])
@token_required
def create_chat(current_user):  # Add current_user parameter here
    print("=== CHAT ENDPOINT DEBUG ===")
    print(f"Authorization header: {request.headers.get('Authorization')}")
    print(f"Token cookie: {request.cookies.get('token')}")
    print(f"Current user: {current_user}")  # Add debug line
    
    try:
        data = request.json
        logging.info(f"Received chat creation request: {data}")
        
        # Extract user_id from the decoded JWT token
        user_id = current_user['userId']  # This comes from your JWT token
        
        # Validate required fields
        if not user_id or not data.get("goals"):
            return jsonify({"error": "Missing required fields (user_id/userId, goals)"}), 400
        
        # Additional validation
        if not validate_user_access(user_id):
            return jsonify({"error": "Invalid user ID"}), 400

        chat_id = str(uuid.uuid4())
        
        # Process skills - handle both string and array formats
        skills = data.get("skills", [])
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(',') if s.strip()]
        
        new_chat = {
            "_id": chat_id,
            "user_id": user_id,  # Store as user_id for consistency with existing schema
            "title": data.get("title", "New Career Chat"),
            "name": data.get("name", ""),
            "email": data.get("email", ""),
            "skills": skills,
            "goals": data.get("goals", ""),
            "domain": data.get("domain", ""),
            "experience": data.get("experience", ""),
            "archived": data.get("archived", False),
            "created_at": datetime.utcnow(),
            "messages": [
                {
                    "role": "assistant",
                    "text": f"Hello {data.get('name', 'there')}! I'm excited to help you with your career goals. Based on your profile:\n\n" +
                           f"• Goals: {data.get('goals')}\n" +
                           (f"• Skills: {', '.join(skills)}\n" if skills else "") +
                           (f"• Domain: {data.get('domain')}\n" if data.get('domain') else "") +
                           (f"• Experience: {data.get('experience')}\n" if data.get('experience') else "") +
                           "\nWhat would you like to explore first? I can help you with career planning, skill development, job search strategies, or interview preparation.",
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
        return jsonify({"error": "Failed to create chat"}), 500

@chat_bp.route('/api/chat/<chat_id>', methods=['GET'])
@token_required
def get_chat(current_user, chat_id):
    try:
        user_id = current_user['userId']
        
        # Build query with privacy protection
        query = {"_id": chat_id, "user_id": user_id}
        
        chat = chats_collection.find_one(query)
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404

        # Format response for frontend
        formatted_chat = {
            "_id": str(chat["_id"]),
            "userId": chat.get("user_id"),  # Convert to frontend format
            "user_id": chat.get("user_id"),  # Keep both for compatibility
            "title": chat.get("title", ""),
            "name": chat.get("name", ""),
            "email": chat.get("email", ""),
            "skills": chat.get("skills", []),
            "goals": chat.get("goals", ""),
            "domain": chat.get("domain", ""),
            "experience": chat.get("experience", ""),
            "archived": chat.get("archived", False),
            "createdAt": chat["created_at"].isoformat(),
            "created_at": chat["created_at"].isoformat(),
            "messages": []
        }
        
        # Format messages
        for msg in chat.get("messages", []):
            formatted_msg = {
                "role": msg.get("role", "user"),
                "content": msg.get("text", ""),  # Convert 'text' to 'content' for frontend
                "text": msg.get("text", ""),     # Keep both for compatibility
                "timestamp": msg["timestamp"].isoformat()
            }
            formatted_chat["messages"].append(formatted_msg)

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
        
        # Verify chat exists and belongs to user
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        # Add user message
        user_message = {
            "role": "user",
            "text": data.get("message"),
            "timestamp": datetime.utcnow()
        }
        
        # Add user message to chat
        chats_collection.update_one(
            {"_id": chat_id},
            {"$push": {"messages": user_message}}
        )
        
        # Here you would integrate with your AI service to generate a response
        # For now, we'll add a simple response
        ai_response = {
            "role": "assistant",
            "text": f"Thank you for your message. I understand you're asking about: '{data.get('message')}'. Let me help you with that based on your career goals and background.",
            "timestamp": datetime.utcnow()
        }
        
        # Add AI response to chat
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
        
        # Verify chat exists and belongs to user
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        archived = data.get("archived", True)
        
        # Update archive status
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
        
        if not data.get("title"):
            return jsonify({"error": "Title is required"}), 400
        
        # Verify chat exists and belongs to user
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        new_title = data.get("title").strip()
        
        # Update title
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
    """Get all chats for a user"""
    try:
        user_id = current_user['userId']
        
        # Get query parameters
        archived = request.args.get('archived', '').lower() == 'true'
        limit = int(request.args.get('limit', 20))
        skip = int(request.args.get('skip', 0))
        
        # Build query
        query = {"user_id": user_id, "archived": archived}
        
        # Get chats with pagination
        chats = list(chats_collection.find(query)
                    .sort("created_at", -1)
                    .skip(skip)
                    .limit(limit))
        
        # Get total count
        total_count = chats_collection.count_documents(query)
        
        # Format response
        formatted_chats = []
        for chat in chats:
            formatted_chat = {
                "_id": str(chat["_id"]),
                "userId": chat.get("user_id"),
                "title": chat.get("title", ""),
                "name": chat.get("name", ""),
                "goals": chat.get("goals", ""),
                "domain": chat.get("domain", ""),
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
    """Delete a chat"""
    try:
        user_id = current_user['userId']
        
        # Verify chat exists and belongs to user
        chat = chats_collection.find_one({"_id": chat_id, "user_id": user_id})
        if not chat:
            return jsonify({"error": "Chat not found or access denied"}), 404
        
        # Delete the chat
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