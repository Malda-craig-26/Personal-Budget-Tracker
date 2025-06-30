import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaSpinner, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        setError('Could not load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/categories',
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, res.data]);
      setNewCategory('');
    } catch (err) {
      setError('Failed to create category');
    }
  };

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/categories/${id}`,
        { name: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categories.map(cat => 
        cat.id === id ? res.data : cat
      ));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update category');
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 text-center">
          Manage Categories
        </h1>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col sm:flex-row gap-4 items-center"
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="p-3 w-full sm:w-2/3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FaPlus /> Add Category
          </motion.button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-4xl text-green-600" />
          </div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {categories.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-600 py-8"
                >
                  No categories found. Add your first category above.
                </motion.p>
              ) : (
                categories.map((cat) => (
                  <motion.li
                    key={cat.id}
                    variants={categoryVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="bg-green-50 p-4 rounded-lg shadow-sm"
                  >
                    {editingId === cat.id ? (
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 p-2 border border-green-300 rounded"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-200 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-700">
                          {cat.name}
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEditing(cat)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            aria-label="Edit category"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Delete category"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.li>
                ))
              )}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default Categories;