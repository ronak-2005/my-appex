from flask import Blueprint, request, jsonify, make_response
from auth.jwt_utils import generate_tokens, verify_token , SECRET_KEY
from model.user_model import create_user, validate_user
from database import users_collection
import jwt
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/api')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    print("=== DEBUG REGISTER ===")
    print(f"Username: {username}")
    print(f"Database: {users_collection.database.name}")
    print(f"Collection: {users_collection.name}")

    existing_user = users_collection.find_one({'username': username})
    print(f"Existing user before creation: {existing_user}")

    success = create_user(users_collection, username, password)
    print(f"Create user result: {success}")

    new_user = users_collection.find_one({'username': username})
    print(f"User after creation: {new_user}")

    total_users = users_collection.count_documents({})
    print(f"Total users in collection: {total_users}")

    if success:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'User already exists'}), 409


@auth_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find({}))
        for user in users:
            user['_id'] = str(user['_id'])

        return jsonify({
            'total_users': len(users),
            'users': users,
            'database': users_collection.database.name,
            'collection': users_collection.name
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    print("=== DEBUG LOGIN ===")
    print(f"Username: {username}")

    user = users_collection.find_one({'username': username})
    print(f"User found: {user is not None}")

    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 401

    valid = validate_user(users_collection, username, password)
    print(f"Validation result: {valid}")

    if not valid:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    user_id = str(user['_id'])  # ✅ Corrected
    print(f"User ID: {user_id}")

    access_token, refresh_token = generate_tokens(username, user_id)
    print("Generated tokens successfully")

    res = make_response(jsonify({
        'success': True,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'userId': user_id,
        'username': username
    }))

    res.set_cookie('token', access_token, httponly=True, samesite='Lax')
    res.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Lax')
    return res


@auth_bp.route('/verify-token', methods=['GET'])
def verify_token_endpoint():
    print("=== VERIFY TOKEN DEBUG ===")
    print(f"SECRET_KEY value: {SECRET_KEY}")  # ✅ Add this debug line
    print(f"SECRET_KEY type: {type(SECRET_KEY)}")
    print(f"SECRET_KEY: {os.getenv('SECRET_KEY')}")
    print(f"JWT_SECRET_KEY: {os.getenv('JWT_SECRET_KEY')}")
    print(f"Current working directory: {os.getcwd()}")
    try:
        # Check Authorization header
        auth_header = request.headers.get('Authorization')
        print(f"Authorization header: {auth_header}")

        # Check cookies
        token_cookie = request.cookies.get('token')
        print(f"Token cookie: {token_cookie}")

        token = None
        if auth_header:
            token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else auth_header
        else:
            token = token_cookie

        print(f"Final token: {token}")

        if not token:
            print("No token found!")
            return jsonify({'error': 'No token provided'}), 401

        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            print(f"Decoded token: {decoded_token}")

            return jsonify({
                'userId': decoded_token.get('userId'),
                'username': decoded_token.get('username') or decoded_token.get('user'),
                'valid': True,
                'debug': decoded_token
            }), 200

        except jwt.ExpiredSignatureError:
            print("Token expired!")
            return jsonify({'error': 'Token expired', 'valid': False}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {e}")
            return jsonify({'error': 'Invalid token', 'valid': False}), 401

    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({'error': 'Token verification failed', 'valid': False}), 401
