from flask import Blueprint, request, jsonify

from backend.controllers.loan_controller import (
    list_loans,
    list_my_loans,
    get_loan,
    create_loan,
    approve_loan,
    reject_loan,
    close_loan,
    delete_loan,
)
from backend.controllers.auth_controller import token_required


loan_bp = Blueprint("loans", __name__)


@loan_bp.get("")
@token_required(roles=["admin"])
def list_loans_route():
    body, status_code = list_loans()
    return jsonify(body), status_code


@loan_bp.get("/me")
@token_required(roles=["teacher", "student"])
def list_my_loans_route():
    body, status_code = list_my_loans()
    return jsonify(body), status_code


@loan_bp.post("")
@token_required(roles=["admin", "teacher", "student"])
def create_loan_route():
    data = request.get_json() or {}
    body, status_code = create_loan(data)
    return jsonify(body), status_code


@loan_bp.get("/<int:loan_id>")
@token_required(roles=["admin"])
def get_loan_route(loan_id):
    body, status_code = get_loan(loan_id)
    return jsonify(body), status_code


@loan_bp.post("/<int:loan_id>/approve")
@token_required(roles=["admin"])
def approve_loan_route(loan_id):
    body, status_code = approve_loan(loan_id)
    return jsonify(body), status_code


@loan_bp.post("/<int:loan_id>/reject")
@token_required(roles=["admin"])
def reject_loan_route(loan_id):
    body, status_code = reject_loan(loan_id)
    return jsonify(body), status_code


@loan_bp.post("/<int:loan_id>/close")
@token_required(roles=["admin"])
def close_loan_route(loan_id):
    body, status_code = close_loan(loan_id)
    return jsonify(body), status_code


@loan_bp.delete("/<int:loan_id>")
@token_required(roles=["admin"])
def delete_loan_route(loan_id):
    body, status_code = delete_loan(loan_id)
    return jsonify(body), status_code
