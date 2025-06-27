# 💸 Personal Budget Tracker

A full-stack personal finance app that helps users track expenses, incomes, and shared budgets. Built using **Flask**, **React**, and **PostgreSQL** with JWT authentication.
---

## 🚀 Features

- 🔐 User registration and login with JWT
- 🧾 Track income and expenses by category
- 📊 Clean dashboard with categorized items
- 👥 Share budget items with others (with % contribution)
- 🌐 Responsive UI using Tailwind CSS + React
- 🔒 Secure backend with hashed passwords and protected routes

---

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- Formik + Yup

**Backend:**
- Flask
- Flask-RESTful / Flask-JWT-Extended
- PostgreSQL
- SQLAlchemy ORM
- Flask-Migrate
- Bcrypt

---

## 📦 Project Structure
Personal-Budget-Tracker/
├── client/ # React frontend
│ └── src/components/ # UI Components
└── server/ # Flask backend
├── models.py
├── app.py
├── config.py
└── seed.py



## ⚙️ Local Setup Instructions

### 1️⃣ Clone the repo

git clone https://github.com/Malda-craig-26/Personal-Budget-Tracker.git
cd Personal-Budget-Tracker

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | /register        | Create new user       |
| POST   | /login           | Login + JWT token     |
| GET    | /categories      | Get user's categories |
| POST   | /categories      | Add a category        |
| DELETE | /categories/\:id | Delete category       |
| POST   | /items           | Add income/expense    |
| GET    | /items           | List all items        |
| POST   | /shared          | Share an item         |
| GET    | /shared          | Get shared items      |

🌍 Deployment
✅ Backend on Render
Create new Web Service

Root directory: server

Build command: pip install -r requirements.txt








