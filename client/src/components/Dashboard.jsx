// File: client/src/components/Dashboard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 drop-shadow">
          Welcome to Your Budget Dashboard
        </h1>
        <p className="text-gray-700 text-lg mb-10">
          Manage your income, expenses, and shared contributions effortlessly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/categories"
            className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow transition flex flex-col items-center text-blue-700"
          >
            <FaFolderOpen className="text-3xl mb-2" />
            <span className="font-semibold">Categories</span>
          </Link>

          <Link
            to="/items"
            className="bg-green-100 hover:bg-green-200 p-6 rounded-xl shadow transition flex flex-col items-center text-green-700"
          >
            <FaMoneyBillWave className="text-3xl mb-2" />
            <span className="font-semibold">Budget Items</span>
          </Link>

          <Link
            to="/shared"
            className="bg-purple-100 hover:bg-purple-200 p-6 rounded-xl shadow transition flex flex-col items-center text-purple-700"
          >
            <FaUsers className="text-3xl mb-2" />
            <span className="font-semibold">Shared Budgets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
