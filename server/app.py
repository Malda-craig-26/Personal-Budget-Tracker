from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import Config
from models import db, User, Category, BudgetItem, SharedBudget

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

@app.route('/')
def index():
    return {'message': 'Budget Tracker API'}



@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    hashed = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Login attempt:", data) 
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({'access_token': token})
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([{'id': c.id, 'name': c.name} for c in categories])

@app.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    data = request.get_json()
    category = Category(name=data['name'], user_id=user_id)
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name}), 201

@app.route('/categories/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    user_id = get_jwt_identity()
    category = Category.query.filter_by(id=id, user_id=user_id).first_or_404()
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'}), 204



@app.route('/items', methods=['POST'])
@jwt_required()
def create_item():
    data = request.get_json()
    user_id = get_jwt_identity()
    category = Category.query.filter_by(id=data['category_id'], user_id=user_id).first()
    if not category:
        return jsonify({'error': 'Invalid category'}), 404

    item = BudgetItem(
        title=data['title'],
        amount=float(data['amount']),
        type=data['type'],
        category_id=data['category_id']
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Item created'}), 201

@app.route('/items', methods=['GET'])
@jwt_required()
def get_items():
    user_id = get_jwt_identity()
    items = BudgetItem.query.join(Category).filter(Category.user_id == user_id).all()
    return jsonify([{
        'id': i.id,
        'title': i.title,
        'amount': i.amount,
        'type': i.type,
        'created_at': i.created_at,
        'category': i.category.name
    } for i in items])


@app.route('/shared', methods=['POST'])
@jwt_required()
def add_shared_budget():
    user_id = get_jwt_identity()
    data = request.get_json()
    item = BudgetItem.query.get(data['budget_item_id'])
    if not item:
        return jsonify({'error': 'Item not found'}), 404

    percent = float(data['contribution_percent'])
    if percent < 0 or percent > 100:
        return jsonify({'error': 'Contribution must be 0-100'}), 400

    shared = SharedBudget(user_id=user_id, budget_item_id=item.id, contribution_percent=percent)
    db.session.add(shared)
    db.session.commit()
    return jsonify({'message': 'Shared budget added'}), 201

@app.route('/shared', methods=['GET'])
@jwt_required()
def get_shared():
    user_id = get_jwt_identity()
    shared = SharedBudget.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'item': s.budget_item.title,
        'amount': s.budget_item.amount,
        'type': s.budget_item.type,
        'contribution_percent': s.contribution_percent
    } for s in shared])

if __name__ == '__main__':
    app.run(debug=True)
