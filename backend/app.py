# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import users_collection
from auth.auth_routes import auth_bp  # ✅ your auth blueprint
from chat.chat import chat_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Enable CORS with credentials (so cookies work in frontend)
    CORS(app, supports_credentials=True)

    # ✅ Register auth routes under /api
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)

    # ✅ Default test route
    @app.route('/')
    def home():
        return jsonify({"message": "API is working!"})

    # ✅ DB connection test route
    @app.route('/api/test-db')
    def test_db():
        try:
            user_count = users_collection.count_documents({})
            return jsonify({"success": True, "user_count": user_count})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
