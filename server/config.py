# server/config.py
import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://budget:budgetxyz@localhost:5432/budget_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
