from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    categories = db.relationship('Category', backref='user', cascade='all, delete-orphan')
    shared_budgets = db.relationship('SharedBudget', backref='user', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<User {self.id} - {self.username}>"


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    items = db.relationship('BudgetItem', backref='category', cascade='all, delete-orphan')
    def __repr__(self):
        return f"<Category {self.id} - {self.name} for User {self.user_id}>"


class BudgetItem(db.Model):
    __tablename__ = 'budget_items'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    shared_budgets = db.relationship('SharedBudget', backref='budget_item', cascade='all, delete-orphan')
    def __repr__(self):
        return f"<BudgetItem {self.id} - {self.title} ({self.type}) for Category {self.category_id} at {self.amount}>"


class SharedBudget(db.Model):
    __tablename__ = 'shared_budgets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    budget_item_id = db.Column(db.Integer, db.ForeignKey('budget_items.id'), nullable=False)

    contribution_percent = db.Column(db.Float, nullable=False)  

    __table_args__ = (
    db.UniqueConstraint('user_id', 'budget_item_id', name='unique_user_item'),
)
    def __repr__(self):
        return f"<SharedBudget {self.id} - User {self.user_id} for Item {self.budget_item_id} at {self.contribution_percent}%>"

    
