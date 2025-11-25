from datetime import datetime

from flask import g

from backend import db
from backend.models import Loan, Equipment, Alert


def list_loans():
    loans = Loan.query.all()
    return {"loans": [l.to_dict() for l in loans]}, 200


def list_my_loans():
    user = getattr(g, "current_user", None)
    if not user:
        return {"message": "Unauthorized"}, 401
    loans = Loan.query.filter_by(user_id=user.id).order_by(Loan.loan_date.desc()).all()
    return {"loans": [l.to_dict() for l in loans]}, 200


def get_loan(loan_id: int):
    loan = Loan.query.get_or_404(loan_id)
    return {"loan": loan.to_dict()}, 200


def create_loan(data):
    user_id = data.get("user_id")
    equipment_id = data.get("equipment_id")

    if not all([user_id, equipment_id]):
        return {"message": "Missing fields"}, 400

    equipment = Equipment.query.get_or_404(equipment_id)
    if equipment.status not in {"available", "pending"}:
        return {"message": "Equipment not available"}, 400

    # Teachers and students create "loan requests" that start as pending.
    # Admins can create immediate active loans that reserve the equipment.
    role = getattr(getattr(g, "current_user", None), "role", None)

    if role in {"teacher", "student"}:
        status = "pending"
        equipment.status = "pending"
    else:
        status = "active"
        equipment.status = "loaned"

    loan = Loan(user_id=user_id, equipment_id=equipment_id, status=status)

    db.session.add(loan)
    db.session.commit()

    return {"loan": loan.to_dict()}, 201


def approve_loan(loan_id: int):
    loan = Loan.query.get_or_404(loan_id)
    equipment = Equipment.query.get_or_404(loan.equipment_id)

    if loan.status != "pending":
        return {"message": "Only pending loans can be approved"}, 400
    if equipment.status not in {"available", "pending"}:
        return {"message": "Equipment is not available"}, 400

    loan.status = "active"
    loan.loan_date = loan.loan_date or datetime.utcnow()
    equipment.status = "loaned"

    db.session.commit()
    return {"loan": loan.to_dict()}, 200


def reject_loan(loan_id: int):
    loan = Loan.query.get_or_404(loan_id)

    if loan.status != "pending":
        return {"message": "Only pending loans can be rejected"}, 400

    loan.status = "rejected"

    # When a pending request is rejected, free the equipment again.
    equipment = Equipment.query.get(loan.equipment_id)
    if equipment and equipment.status == "pending":
        equipment.status = "available"

    db.session.commit()
    return {"loan": loan.to_dict()}, 200


def close_loan(loan_id: int, create_alert: bool = True):
    loan = Loan.query.get_or_404(loan_id)
    equipment = Equipment.query.get_or_404(loan.equipment_id)

    if loan.status != "active":
        return {"message": "Loan is not active"}, 400

    loan.status = "returned"
    loan.return_date = datetime.utcnow()
    equipment.status = "available"

    # Example: create an informational alert when a loan is closed
    if create_alert:
        alert = Alert(loan_id=loan.id, alert_type="returned")
        db.session.add(alert)

    db.session.commit()
    return {"loan": loan.to_dict()}, 200


def delete_loan(loan_id: int):
    loan = Loan.query.get_or_404(loan_id)
    db.session.delete(loan)
    db.session.commit()
    return {"message": "Loan deleted"}, 200
