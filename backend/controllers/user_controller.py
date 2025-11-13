from backend import db
from backend.models import User


def list_users():
    users = User.query.all()
    return {"users": [u.to_dict() for u in users]}, 200


def get_user(user_id: int):
    user = User.query.get_or_404(user_id)
    return {"user": user.to_dict()}, 200


def create_user(data):
    from .auth_controller import hash_password  # avoid circular import

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not all([name, email, password]):
        return {"message": "Missing fields"}, 400

    if User.query.filter_by(email=email).first():
        return {"message": "Email already exists"}, 400

    user = User(name=name, email=email, password=hash_password(password), role=role)
    db.session.add(user)
    db.session.commit()

    return {"user": user.to_dict()}, 201


def update_user(user_id: int, data):
    user = User.query.get_or_404(user_id)

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)

    db.session.commit()
    return {"user": user.to_dict()}, 200


def delete_user(user_id: int):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return {"message": "User deleted"}, 200
