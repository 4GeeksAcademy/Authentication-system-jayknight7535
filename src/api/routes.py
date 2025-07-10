"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    get_current_user, jwt_required
)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/signup", meathods= ["POST"])
def signup():
    User=User(**request.json)
    db.session.add(User)
    db.session.commit()
    return "", 200

@api.route("/login", meathods=["POST"])
def login():
    User= db.session.scalars(
        db.select(User)
        .filter_by(username=request.json["username"])
    ).one_or_none()
    if not User:
        return jsonify(msg="not valid"), 401
    if not User.check_password_hash(request.jason["password"]):
        return jsonify(msg="not valid"), 401
    return jsonify(token=create_access_token(User))

@api.route("/secret", meathods=["GET"])
@jwt_required()
def the_secret ():
    return jsonify(msg="it's not a very exciting secret"), 200


