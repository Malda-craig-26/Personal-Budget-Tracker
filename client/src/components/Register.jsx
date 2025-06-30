import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaLock, FaSpinner, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.length < 4) newErrors.username = 'Username must be at least 4 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (res.ok) {
        navigate('/login', { state: { registrationSuccess: true } });
      } else {
        const data = await res.json();
        setErrors({ server: data.error || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ server: 'Network error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm relative"
      >
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 left-4 text-gray-500 hover:text-green-600 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold text-center text-green-600 mb-3">Create Account 🧾</h2>
          <p className="text-center text-gray-500 mb-6">Track your income and expenses with ease.</p>

          {errors.server && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {errors.server}
            </motion.div>
          )}

          <div className="mb-4">
            <div className="relative">
              <FaUserPlus className="absolute top-3 left-3 text-gray-400" />
              <input
                name="username"
                className={`w-full pl-10 p-2 border ${errors.username ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {errors.username && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mt-1 ml-1"
              >
                {errors.username}
              </motion.p>
            )}
          </div>

          <div className="mb-4">
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-10 p-2 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-green-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mt-1 ml-1"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full pl-10 pr-10 p-2 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-green-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs mt-1 ml-1"
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className={`w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center ${
              isLoading ? 'opacity-80' : 'hover:bg-green-700'
            } transition-all duration-200`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </motion.button>

          <div className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <motion.button
              type="button"
              onClick={() => navigate('/login')}
              className="text-green-600 font-medium hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Log in
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
}

export default Register;