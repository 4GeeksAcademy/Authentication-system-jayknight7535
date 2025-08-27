from flask import Blueprint, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from api.models import db, User


api = Blueprint('api', __name__)
CORS(api)

# ----- Signup Route -----
@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    required_fields = ('username', 'email', 'password')
    missing = [field for field in required_fields if field not in data]

    if missing:
        return jsonify({"msg": f"Missing fields: {', '.join(missing)}"}), 400

    if len(data["password"]) < 8:
        return jsonify({"msg": "Password must be at least 8 characters long"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"msg": "Username already exists"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already exists"}), 400

    user = User(
        username=data["username"],
        email=data["email"]
    )
    user.password = data["password"]

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        logging.error(f"Signup error: {e}")
        db.session.rollback()
        return jsonify({"msg": "Signup failed due to server error"}), 500

    return jsonify({"msg": "User created successfully"}), 201




# ----- Login Route -----
@api.route("/token", methods=["POST"])
def login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"msg": "Missing username or password"}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(hours=1)
    )

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200


# ----- Protected Route Example -----
@api.route("/secret", methods=["GET"])
@jwt_required()
def super_secret():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    return jsonify(
        msg="*super obvious whispering.*",
        user=user.serialize()
    ), 200
