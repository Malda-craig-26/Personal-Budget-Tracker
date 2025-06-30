import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShareAlt, FaTrash, FaSpinner, FaMoneyBillWave, FaPercentage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function SharedBudgets() {
  const [sharedBudgets, setSharedBudgets] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    budget_item_id: '',
    contribution_percent: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchData();
  }, [navigate, token]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sharedRes, itemsRes] = await Promise.all([
        axios.get('/shared', { headers }),
        axios.get('/items', { headers })
      ]);
      setSharedBudgets(sharedRes.data);
      setBudgetItems(itemsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.budget_item_id || !formData.contribution_percent) {
      setError('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/shared', formData, { headers });
      setFormData({ budget_item_id: '', contribution_percent: '' });
      setSuccess('Shared budget added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add shared budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this shared budget?')) return;
    
    try {
      await axios.delete(`/shared/${id}`, { headers });
      setSuccess('Shared budget removed!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchData();
    } catch (err) {
      setError('Failed to delete shared budget');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <FaShareAlt className="text-3xl text-pink-600" />
          <h2 className="text-3xl font-bold text-pink-700">Shared Budgets</h2>
        </motion.div>

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

        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-10"
          whileHover={{ scale: 1.005 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Shared Contribution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Item</label>
              <select
                name="budget_item_id"
                value={formData.budget_item_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Select Budget Item</option>
                {budgetItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({formatCurrency(item.amount)} - {item.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contribution %</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaPercentage />
                </span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  name="contribution_percent"
                  value={formData.contribution_percent}
                  onChange={handleChange}
                  placeholder="0-100"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className={`px-6 py-3 bg-pink-600 text-white rounded-lg flex items-center gap-2 justify-center w-full md:w-auto ${
              isLoading ? 'opacity-70' : 'hover:bg-pink-700'
            } transition-colors`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              <>
                <FaShareAlt /> Add Shared Budget
              </>
            )}
          </motion.button>
        </motion.form>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Your Shared Contributions</h3>
            <button 
              onClick={fetchData}
              className="text-pink-600 hover:text-pink-800 flex items-center gap-1"
            >
              Refresh
            </button>
          </div>

          {isLoading && sharedBudgets.length === 0 ? (
            <div className="flex justify-center py-10">
              <FaSpinner className="animate-spin text-4xl text-pink-600" />
            </div>
          ) : sharedBudgets.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-8"
            >
              No shared budgets found. Add your first shared budget above.
            </motion.p>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {sharedBudgets.map((s) => (
                  <motion.li
                    key={s.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="border border-gray-200 p-4 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className={`text-lg ${
                            s.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`} />
                          <p className="font-medium text-gray-800">{s.item}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          You contribute: <span className="font-semibold">{s.contribution_percent}%</span> • 
                          Your share: <span className="font-semibold">{formatCurrency(s.amount)}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Delete shared budget"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default SharedBudgets;