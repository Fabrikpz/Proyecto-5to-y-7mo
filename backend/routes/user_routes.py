from flask import Blueprint, request, jsonify

from backend.controllers.user_controller import (
    list_users,
    get_user,
    create_user,
    update_user,
    delete_user,
)
from backend.controllers.auth_controller import token_required

user_bp = Blueprint("users", __name__)


@user_bp.get("")
@token_required(roles=["admin"])
def list_users_route():
    body, status = list_users()
    return jsonify(body), status


@user_bp.post("")
@token_required(roles=["admin"])
def create_user_route():
    data = request.get_json() or {}
    body, status = create_user(data)
    return jsonify(body), status


@user_bp.get("/<int:user_id>")
@token_required(roles=["admin"])
def get_user_route(user_id):
    body, status = get_user(user_id)
    return jsonify(body), status


@user_bp.put("/<int:user_id>")
@token_required(roles=["admin"])
def update_user_route(user_id):
    data = request.get_json() or {}
    body, status = update_user(user_id, data)
    return jsonify(body), status


@user_bp.delete("/<int:user_id>")
@token_required(roles=["admin"])
def delete_user_route(user_id):
    body, status = delete_user(user_id)
    return jsonify(body), status
