// App.jsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Items from './components/Items';
import SharedBudgets from './components/SharedBudgets';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-700 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">💰 Budget Tracker</h1>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/categories" className="hover:underline">Categories</Link>
          <Link to="/items" className="hover:underline">Items</Link>
          <Link to="/shared" className="hover:underline">Shared Budgets</Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="ml-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared"
          element={
            <ProtectedRoute>
              <SharedBudgets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
