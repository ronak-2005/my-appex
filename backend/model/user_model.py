from werkzeug.security import generate_password_hash, check_password_hash

def create_user(collection, username, password):
    if collection.find_one({'username': username}):
        return False
    hashed_pw = generate_password_hash(password)
    collection.insert_one({'username': username, 'password': hashed_pw})
    return True

def validate_user(collection, username, password):
    user = collection.find_one({'username': username})
    if not user:
        return False
    return check_password_hash(user['password'], password)
