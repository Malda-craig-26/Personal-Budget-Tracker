// File: client/src/components/SharedBudgets.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SharedBudgets() {
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    budget_item_id: '',
    contribution_percent: ''
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    if (!token) return navigate('/login');

    axios.get('/shared', { headers })
      .then(res => setSharedBudgets(res.data))
      .catch(err => console.error(err));

    axios.get('/items', { headers })
      .then(res => setBudgetItems(res.data))
      .catch(err => console.error(err));
  }, [navigate, token]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/shared', formData, { headers })
      .then(() => {
        setFormData({ budget_item_id: '', contribution_percent: '' });
        return axios.get('/shared', { headers });
      })
      .then(res => setSharedBudgets(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-700 mb-6">Shared Budgets</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="budget_item_id"
              value={formData.budget_item_id}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Budget Item</option>
              <option value=""></option>

              {budgetItems.map(item => (
                <option key={item.id} value={item.id}>{item.title} (${item.amount})</option>
              ))}
            </select>
            <input
              type="number"
              name="contribution_percent"
              value={formData.contribution_percent}
              onChange={handleChange}
              placeholder="Contribution %"
              className="border p-2 rounded"
              required
            />
          </div>
          <button type="submit" className="mt-4 px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
            Add Shared Budget
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Your Shared Contributions</h3>
          <ul className="space-y-2">
            {sharedBudgets.map((s, index) => (
              <li key={index} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{s.item} ({s.type})</p>
                  <p className="text-sm text-gray-600">You contribute: {s.contribution_percent}%</p>
                </div>
                <span className="text-lg font-bold text-gray-800">${s.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SharedBudgets;
