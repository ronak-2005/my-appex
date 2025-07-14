from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt  
from config import Config
from database import users_collection
from auth.auth_routes import auth_bp
from chat.chat import chat_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Correct CORS configuration
    CORS(app, 
         supports_credentials=True,
         origins=["http://localhost:3000"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"]
    )

    # ✅ Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)

    # ✅ Health check
    @app.route('/')
    def home():
        return jsonify({"message": "API is working!"})

    # ✅ Debug route (optional)
    @app.route('/api/debug-headers', methods=['GET', 'POST', 'OPTIONS'])
    def debug_headers():
        return jsonify({
            'method': request.method,
            'headers': dict(request.headers),
            'origin': request.headers.get('Origin'),
            'cookies': dict(request.cookies),
            'data': request.get_json() if request.is_json else None
        })

    @app.route('/api/test-db')
    def test_db():
        try:
            user_count = users_collection.count_documents({})
            return jsonify({"success": True, "user_count": user_count})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    return app

# ✅ App entry point
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
