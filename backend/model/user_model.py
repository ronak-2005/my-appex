from werkzeug.security import generate_password_hash, check_password_hash

def create_user(collection, username, password):
    print(f"Creating user: {username}")
    print(f"Collection: {collection.name}")
    
    if collection.find_one({'username': username}):
        print("User already exists!")
        return False
    
    hashed_pw = generate_password_hash(password)
    print(f"Hashed password: {hashed_pw[:20]}...")
    
    try:
        result = collection.insert_one({'username': username, 'password': hashed_pw})
        print(f"Insert result: {result.inserted_id}")
        
        # Verify the insert worked
        inserted_user = collection.find_one({'_id': result.inserted_id})
        print(f"Verification - user was inserted: {inserted_user is not None}")
        
        return True
    except Exception as e:
        print(f"Error inserting user: {e}")
        return False

def validate_user(collection, username, password):
    print(f"Validating user: {username}")
    user = collection.find_one({'username': username})
    print(f"User found: {user is not None}")
    
    if not user:
        print("No user found in database")
        return False
    
    print(f"User password hash: {user.get('password', 'NO PASSWORD')[:20]}...")
    result = check_password_hash(user['password'], password)
    print(f"Password check result: {result}")
    return result