// File: client/src/components/Categories.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus } from 'react-icons/fa';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch(() => setError('Could not load categories'));
  }, [token]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setCategories(categories.filter((cat) => cat.id !== id)))
      .catch(() => setError('Failed to delete category'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    axios
      .post(
        'http://localhost:5000/categories',
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setCategories([...categories, res.data]);
        setNewCategory('');
      })
      .catch(() => setError('Failed to create category'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">Manage Categories</h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="mb-6 flex gap-4 items-center justify-center"
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="p-2 w-2/3 rounded border border-gray-300"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </form>

        <ul className="space-y-4">
          {categories.length === 0 ? (
            <p className="text-center text-gray-600">No categories found.</p>
          ) : (
            categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center bg-green-50 p-4 rounded shadow-sm"
              >
                <span className="text-lg font-medium text-gray-700">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Categories;
