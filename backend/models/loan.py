from datetime import datetime
from backend import db


class Loan(db.Model):
    __tablename__ = "loans"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    equipment_id = db.Column(db.Integer, db.ForeignKey("equipments.id"), nullable=False)
    loan_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    return_date = db.Column(db.DateTime, nullable=True)
    # pending -> active (approved) -> returned / rejected / cancelled
    status = db.Column(db.String(30), nullable=False, default="pending")

    user = db.relationship("User", back_populates="loans")
    equipment = db.relationship("Equipment", back_populates="loans")
    alerts = db.relationship("Alert", back_populates="loan", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "equipment_id": self.equipment_id,
            "loan_date": self.loan_date.isoformat() if self.loan_date else None,
            "return_date": self.return_date.isoformat() if self.return_date else None,
            "status": self.status,
            # lightweight joined info for UI convenience
            "user_name": self.user.name if self.user else None,
            "equipment_name": self.equipment.name if self.equipment else None,
        }
