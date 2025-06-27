from app import app, db
from models import User, Category, BudgetItem, SharedBudget
from flask_bcrypt import Bcrypt
from faker import Faker

bcrypt = Bcrypt(app)

with app.app_context():
    print("Seeding database...")
   

    # Create tables
    db.create_all()

    # Clear existing data
    SharedBudget.query.delete()
    BudgetItem.query.delete()
    Category.query.delete()
    User.query.delete()

    # Create users
    u1 = User(username='Alice', password_hash=bcrypt.generate_password_hash('password').decode('utf-8'))
    u2 = User(username='Bob', password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'))
    u3 = User(username='Charlie', password_hash=bcrypt.generate_password_hash('mypassword').decode('utf-8'))
    u4 = User(username='Dave', password_hash=bcrypt.generate_password_hash('secret').decode('utf-8'))
    u5 = User(username='Kimberly', password_hash=bcrypt.generate_password_hash('123456').decode('utf-8'))
    u6 = User(username='Eve', password_hash=bcrypt.generate_password_hash('qwerty').decode('utf-8'))

    db.session.add_all([u1, u2,u3,u4,u5,u6])
    db.session.commit()

    # Create categories
    food = Category(name='Food', user_id=u1.id)
    rent = Category(name='Rent', user_id=u1.id)
    misc = Category(name='Misc', user_id=u2.id)
    netflix = Category(name='Entertainment', user_id=u3.id)
    travel = Category(name='Travel', user_id=u4.id)
    bills = Category(name='Bills', user_id=u5.id)
    db.session.add_all([food, rent, misc, netflix, travel])
    db.session.commit()

    # Create budget items
    i1 = BudgetItem(title='Groceries', amount=150.0, type='expense', category_id=food.id)
    i2 = BudgetItem(title='Apartment Rent', amount=800.0, type='expense', category_id=rent.id)
    i3 = BudgetItem(title='Freelance Income', amount=500.0, type='income', category_id=misc.id)
    i4 = BudgetItem(title='Netflix Subscription', amount=300.0, type='expense', category_id=netflix.id)
    i5 = BudgetItem(title='Flight to Paris', amount=3000.0, type='expense', category_id=travel.id)
    i6 = BudgetItem(title='Salary', amount=200000, type='income', category_id=rent.id)
    db.session.add_all([i1, i2, i3, i4, i5, i6])
    db.session.commit()

    shared = SharedBudget(user_id=u2.id, budget_item_id=i2.id, contribution_percent=25.0)
    shared2 = SharedBudget(user_id=u3.id, budget_item_id=i4.id, contribution_percent=50.0)
    shared3 = SharedBudget(user_id=u4.id, budget_item_id=i5.id, contribution_percent=75.0)
    shared4 = SharedBudget(user_id=u5.id, budget_item_id=i6.id, contribution_percent=100.0)

    db.session.add(shared2)
    db.session.add(shared3)
    db.session.add(shared4)
    db.session.add(shared)
    db.session.commit()

    print("✅ Done seeding!")
