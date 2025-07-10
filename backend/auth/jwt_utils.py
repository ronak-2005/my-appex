# auth/jwt_utils.py
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def generate_tokens(username, user_id):  # ✅ Accept both username and user_id
    payload = {
        'username': username,  # ✅ Changed from 'user' to 'username'
        'userId': str(user_id),  # ✅ Added userId
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        'type': 'access'
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    refresh_payload = {
        'username': username,
        'userId': str(user_id),  
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'type': 'refresh'
    }
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm='HS256')

    return access_token, refresh_token

def verify_token(token, expected_type='access'):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if payload.get('type') != expected_type:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None