import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        navigate('/');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-3">Welcome Back 👋</h2>
          <p className="text-center text-gray-500 mb-6">Log in to manage your budget smarter.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="relative mb-4">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              className="w-full pl-10 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-6">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-10 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center ${
              isLoading ? 'opacity-80' : 'hover:bg-blue-700'
            } transition-all duration-200`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </motion.button>

          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <motion.button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-600 font-medium hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Sign up
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
}

export default Login;