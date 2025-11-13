from flask import Blueprint, request, jsonify

from backend.controllers.auth_controller import register_user, login_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    body, status = register_user(data)
    return jsonify(body), status


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    body, status = login_user(data)
    return jsonify(body), status
