from functools import wraps
from datetime import datetime, timedelta

import jwt
from flask import current_app, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash

from backend import db
from backend.models import User


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(hash_: str, password: str) -> bool:
    return check_password_hash(hash_, password)


def generate_token(user: User) -> str:
    payload = {
        "sub": user.id,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=8),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm=current_app.config["JWT_ALGORITHM"])


def decode_token(token: str):
    return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=[current_app.config["JWT_ALGORITHM"]])


def token_required(roles=None):
    roles = roles or []

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return jsonify({"message": "Authorization header missing or invalid"}), 401

            token = auth_header.split(" ", 1)[1]
            try:
                payload = decode_token(token)
                user = User.query.get(payload.get("sub"))
                if not user:
                    return jsonify({"message": "User not found"}), 401
                if roles and user.role not in roles:
                    return jsonify({"message": "Forbidden"}), 403
                g.current_user = user
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token"}), 401

            return f(*args, **kwargs)

        return wrapper

    return decorator


def register_user(data):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not all([name, email, password]):
        return {"message": "Missing fields"}, 400

    if User.query.filter_by(email=email).first():
        return {"message": "Email already registered"}, 400

    user = User(name=name, email=email, password=hash_password(password), role=role)
    db.session.add(user)
    db.session.commit()

    return {"user": user.to_dict()}, 201


def login_user(data):
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return {"message": "Missing credentials"}, 400

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(user.password, password):
        return {"message": "Invalid credentials"}, 401

    token = generate_token(user)
    return {"token": token, "user": user.to_dict()}, 200
