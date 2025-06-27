from flask import Blueprint, request, jsonify, make_response
from auth.jwt_utils import generate_tokens, verify_token
from model.user_model import create_user, validate_user
from database import users_collection

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    success = create_user(users_collection, data['username'], data['password'])
    if success:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'User already exists'}), 409

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    valid = validate_user(users_collection, data['username'], data['password'])
    if not valid:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    access_token, refresh_token = generate_tokens(data['username'])

    res = make_response(jsonify({'success': True}))
    res.set_cookie('token', access_token, httponly=True, samesite='Lax')
    res.set_cookie('refresh_token', refresh_token, httponly=True, samesite='Lax')
    return res

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    token = request.cookies.get('refresh_token')
    decoded = verify_token(token, expected_type='refresh')
    if not decoded:
        return jsonify({'success': False, 'message': 'Invalid or expired refresh token'}), 401

    access_token, _ = generate_tokens(decoded['user'])
    res = make_response(jsonify({'success': True}))
    res.set_cookie('token', access_token, httponly=True, samesite='Lax')
    return res

@auth_bp.route('/verify', methods=['GET'])
def verify():
    token = request.cookies.get('token')
    decoded = verify_token(token)
    if not decoded:
        return jsonify({'authenticated': False}), 401
    return jsonify({'authenticated': True, 'user': decoded['user']})

@auth_bp.route('/logout', methods=['POST'])
def logout():
    res = make_response(jsonify({'success': True}))
    res.set_cookie('token', '', max_age=0)
    res.set_cookie('refresh_token', '', max_age=0)
    return res
