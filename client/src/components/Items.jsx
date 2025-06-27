// File: client/src/components/Items.jsx

import React, { useState, useEffect } from 'react';

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', type: '', category_id: '' });
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('http://localhost:5000/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:5000/categories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: '', amount: '', type: '', category_id: '' });
      fetchItems();
    }
  };

  return (
    <div>
      <h2>Budget Items</h2>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {i.title} - ${i.amount} ({i.type}) in {i.category}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default Items;
