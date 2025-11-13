from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import get_config

# Global db instance

db = SQLAlchemy()


def create_app(config_name: str = None):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.user_routes import user_bp
    from .routes.equipment_routes import equipment_bp
    from .routes.loan_routes import loan_bp
    from .routes.alert_routes import alerts_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(equipment_bp, url_prefix="/api/equipments")
    app.register_blueprint(loan_bp, url_prefix="/api/loans")
    app.register_blueprint(alerts_bp, url_prefix="/api/alerts")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}, 200

    return app
