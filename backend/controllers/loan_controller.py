from datetime import datetime

from backend import db
from backend.models import Loan, Equipment, Alert


def list_loans():
    loans = Loan.query.all()
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
    if equipment.status != "available":
        return {"message": "Equipment not available"}, 400

    loan = Loan(user_id=user_id, equipment_id=equipment_id, status="active")
    equipment.status = "loaned"

    db.session.add(loan)
    db.session.commit()

    return {"loan": loan.to_dict()}, 201


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
