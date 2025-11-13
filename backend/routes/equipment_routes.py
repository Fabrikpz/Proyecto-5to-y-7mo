from flask import Blueprint, request, jsonify

from backend.controllers.equipment_controller import (
    list_equipments,
    get_equipment,
    create_equipment,
    update_equipment,
    delete_equipment,
)
from backend.controllers.auth_controller import token_required


equipment_bp = Blueprint("equipments", __name__)


@equipment_bp.get("")
@token_required(roles=["admin", "teacher", "student"])
def list_equipments_route():
    status = request.args.get("status")
    body, status_code = list_equipments(status)
    return jsonify(body), status_code


@equipment_bp.post("")
@token_required(roles=["admin"])
def create_equipment_route():
    data = request.get_json() or {}
    body, status_code = create_equipment(data)
    return jsonify(body), status_code


@equipment_bp.get("/<int:equipment_id>")
@token_required(roles=["admin", "teacher", "student"])
def get_equipment_route(equipment_id):
    body, status_code = get_equipment(equipment_id)
    return jsonify(body), status_code


@equipment_bp.put("/<int:equipment_id>")
@token_required(roles=["admin"])
def update_equipment_route(equipment_id):
    data = request.get_json() or {}
    body, status_code = update_equipment(equipment_id, data)
    return jsonify(body), status_code


@equipment_bp.delete("/<int:equipment_id>")
@token_required(roles=["admin"])
def delete_equipment_route(equipment_id):
    body, status_code = delete_equipment(equipment_id)
    return jsonify(body), status_code
