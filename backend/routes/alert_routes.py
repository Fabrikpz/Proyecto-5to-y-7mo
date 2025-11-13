from flask import Blueprint, request, jsonify

from backend import db
from backend.models import Alert
from backend.controllers.auth_controller import token_required

alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.get("")
@token_required(roles=["admin", "teacher"])
def list_alerts_route():
    alerts = Alert.query.order_by(Alert.date.desc()).all()
    body = {"alerts": [a.to_dict() for a in alerts]}
    return jsonify(body), 200


@alerts_bp.post("")
@token_required(roles=["admin", "teacher"])
def create_alert_route():
    data = request.get_json() or {}
    loan_id = data.get("loan_id")
    alert_type = data.get("alert_type")

    if not all([loan_id, alert_type]):
        return jsonify({"message": "Missing fields"}), 400

    alert = Alert(loan_id=loan_id, alert_type=alert_type)
    db.session.add(alert)
    db.session.commit()

    return jsonify({"alert": alert.to_dict()}), 201
