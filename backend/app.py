from backend import create_app, db
from backend.models import user, equipment, loan, alert  # noqa: F401

app = create_app()


@app.cli.command("create-db")
def create_db():
    """Create database tables."""
    with app.app_context():
        db.create_all()
        print("Database tables created.")


if __name__ == "__main__":
    print("\n=== Registered Routes ===")
    for rule in app.url_map.iter_rules():
        print(rule)
    print("=========================\n")

    app.run(debug=True)
