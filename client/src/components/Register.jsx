import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaLock } from 'react-icons/fa';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      navigate('/login');
    } else {
      const data = await res.json();
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-3">Create Account 🧾</h2>
        <p className="text-center text-gray-500 mb-6">Track your income and expenses with ease.</p>

        <div className="relative mb-4">
          <FaUserPlus className="absolute top-3 left-3 text-gray-400" />
          <input
            className="w-full pl-10 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="relative mb-6">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            className="w-full pl-10 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;