from backend import db
from backend.models import Equipment


VALID_STATUSES = {"available", "loaned", "under_maintenance", "pending"}


def list_equipments(status: str | None = None):
    query = Equipment.query
    if status:
        query = query.filter_by(status=status)
    equipments = query.all()
    return {"equipments": [e.to_dict() for e in equipments]}, 200


def get_equipment(equipment_id: int):
    equipment = Equipment.query.get_or_404(equipment_id)
    return {"equipment": equipment.to_dict()}, 200


def create_equipment(data):
    name = data.get("name")
    type_ = data.get("type")
    status = data.get("status", "available")
    description = data.get("description")

    if not all([name, type_]):
        return {"message": "Missing fields"}, 400
    if status not in VALID_STATUSES:
        return {"message": "Invalid status"}, 400

    equipment = Equipment(name=name, type=type_, status=status, description=description)
    db.session.add(equipment)
    db.session.commit()

    return {"equipment": equipment.to_dict()}, 201


def update_equipment(equipment_id: int, data):
    equipment = Equipment.query.get_or_404(equipment_id)

    status = data.get("status", equipment.status)
    if status not in VALID_STATUSES:
        return {"message": "Invalid status"}, 400

    equipment.name = data.get("name", equipment.name)
    equipment.type = data.get("type", equipment.type)
    equipment.status = status
    equipment.description = data.get("description", equipment.description)

    db.session.commit()
    return {"equipment": equipment.to_dict()}, 200


def delete_equipment(equipment_id: int):
    equipment = Equipment.query.get_or_404(equipment_id)
    db.session.delete(equipment)
    db.session.commit()
    return {"message": "Equipment deleted"}, 200
