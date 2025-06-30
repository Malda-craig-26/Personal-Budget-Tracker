import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    amount: '', 
    type: 'expense', 
    category_id: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:5000/items', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/categories', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const itemsData = await itemsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category_id) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const url = editingId 
        ? `http://localhost:5000/items/${editingId}`
        : 'http://localhost:5000/items';
        
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: '', amount: '', type: 'expense', category_id: '' });
        setEditingId(null);
        setSuccess(editingId ? 'Item updated!' : 'Item added!');
        setTimeout(() => setSuccess(''), 3000);
        fetchData();
      }
    } catch (err) {
      setError('Failed to save item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        setSuccess('Item deleted!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      amount: item.amount,
      type: item.type,
      category_id: item.category_id
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ title: '', amount: '', type: 'expense', category_id: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          <FaMoneyBillWave /> Budget Items
        </h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Item title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2 ${isLoading ? 'opacity-70' : 'hover:bg-indigo-700'} transition-colors`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FaPlus /> {editingId ? 'Update Item' : 'Add Item'}
                </>
              )}
            </motion.button>
          </div>
        </form>

        {isLoading && items.length === 0 ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-4xl text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-8"
                >
                  No budget items found. Add your first item above.
                </motion.p>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`p-4 rounded-lg shadow-sm border-l-4 ${item.type === 'income' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          {categories.find(c => c.id === item.category_id)?.name || 'Uncategorized'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.type === 'income' ? (
                            <span className="flex items-center gap-1">
                              <FaArrowUp className="text-green-500" /> {formatCurrency(item.amount)}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <FaArrowDown className="text-red-500" /> {formatCurrency(item.amount)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(item)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2"
                            aria-label="Edit item"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            aria-label="Delete item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;