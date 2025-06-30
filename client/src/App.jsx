import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { FaHome, FaList, FaMoneyBillWave, FaUsers, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import Items from './components/Items';
import SharedBudgets from './components/SharedBudgets';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const navLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/categories', name: 'Categories', icon: <FaList /> },
    { path: '/items', name: 'Budget Items', icon: <FaMoneyBillWave /> },
    { path: '/shared', name: 'Shared Budgets', icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Navigation Sidebar */}
      <motion.nav
        initial={{ x: -300 }}
        animate={{ x: isMenuOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white z-40 shadow-xl transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex`}
      >
        <div className="p-6 flex flex-col h-full">
          <h1 className="font-bold text-2xl mb-8 flex items-center gap-2">
            <FaMoneyBillWave /> Budget Tracker
          </h1>

          <div className="flex-1 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === link.path ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="md:ml-64 transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-8"
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />

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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;