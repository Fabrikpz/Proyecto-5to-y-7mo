from flask import Blueprint, request, jsonify

from backend.controllers.loan_controller import (
    list_loans,
    get_loan,
    create_loan,
    close_loan,
    delete_loan,
)
from backend.controllers.auth_controller import token_required


loan_bp = Blueprint("loans", __name__)


@loan_bp.get("")
@token_required(roles=["admin", "teacher", "student"])
def list_loans_route():
    body, status_code = list_loans()
    return jsonify(body), status_code


@loan_bp.post("")
@token_required(roles=["admin", "teacher"])
def create_loan_route():
    data = request.get_json() or {}
    body, status_code = create_loan(data)
    return jsonify(body), status_code


@loan_bp.get("/<int:loan_id>")
@token_required(roles=["admin", "teacher", "student"])
def get_loan_route(loan_id):
    body, status_code = get_loan(loan_id)
    return jsonify(body), status_code


@loan_bp.post("/<int:loan_id>/close")
@token_required(roles=["admin", "teacher"])
def close_loan_route(loan_id):
    body, status_code = close_loan(loan_id)
    return jsonify(body), status_code


@loan_bp.delete("/<int:loan_id>")
@token_required(roles=["admin"])
def delete_loan_route(loan_id):
    body, status_code = delete_loan(loan_id)
    return jsonify(body), status_code
