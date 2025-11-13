from datetime import datetime
from backend import db


class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey("loans.id"), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)  # e.g. overdue, reminder
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    loan = db.relationship("Loan", back_populates="alerts")

    def to_dict(self):
        return {
            "id": self.id,
            "loan_id": self.loan_id,
            "alert_type": self.alert_type,
            "date": self.date.isoformat() if self.date else None,
        }
