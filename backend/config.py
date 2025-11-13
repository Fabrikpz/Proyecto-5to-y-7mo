import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('MYSQL_USER','root')}:{os.getenv('MYSQL_PASSWORD','')}@"
        f"{os.getenv('MYSQL_HOST','127.0.0.1')}:{os.getenv('MYSQL_PORT','3306')}/"
        f"{os.getenv('MYSQL_DB','equipment_loans')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ALGORITHM = "HS256"
    PERMANENT_SESSION_LIFETIME = timedelta(hours=8)
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

class DevelopmentConfig(Config):
    DEBUG = True

config_by_name = {
    "development": DevelopmentConfig,
}

def get_config(name: str = None):
    return config_by_name.get(name or os.getenv("FLASK_ENV", "development"), DevelopmentConfig)
