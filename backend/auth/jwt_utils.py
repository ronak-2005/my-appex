import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

def generate_tokens(user):
    payload = {
        'user': user,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
        'type': 'access'
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    refresh_payload = {
        'user': user,
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
