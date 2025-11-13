from datetime import datetime
from backend import db


class Equipment(db.Model):
    __tablename__ = "equipments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # laptop, projector, tablet, camera
    status = db.Column(db.String(30), nullable=False, default="available")  # available, loaned, under_maintenance
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    loans = db.relationship("Loan", back_populates="equipment", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "status": self.status,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
