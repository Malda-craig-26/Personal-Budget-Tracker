// File: client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen, FaMoneyBillWave, FaUsers, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hover: {
      y: -5,
      scale: 1.03,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-blue-700 mb-6 drop-shadow"
          >
            Welcome to Your Budget Dashboard
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-700 text-lg mb-10"
          >
            Manage your income, expenses, and shared contributions effortlessly.
          </motion.p>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              onMouseEnter={() => setActiveCard('categories')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <Link
                to="/categories"
                className="relative block"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`bg-blue-100 p-6 rounded-xl shadow transition flex flex-col items-center text-blue-700 ${activeCard === 'categories' ? 'ring-4 ring-blue-300' : ''}`}
                >
                  <FaFolderOpen className="text-3xl mb-2" />
                  <span className="font-semibold">Categories</span>
                  <motion.div 
                    animate={{ x: activeCard === 'categories' ? 5 : 0 }}
                    className="mt-2 flex items-center justify-center text-sm"
                  >
                    View details <FaArrowRight className="ml-1" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              onMouseEnter={() => setActiveCard('items')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <Link
                to="/items"
                className="relative block"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`bg-green-100 p-6 rounded-xl shadow transition flex flex-col items-center text-green-700 ${activeCard === 'items' ? 'ring-4 ring-green-300' : ''}`}
                >
                  <FaMoneyBillWave className="text-3xl mb-2" />
                  <span className="font-semibold">Budget Items</span>
                  <motion.div 
                    animate={{ x: activeCard === 'items' ? 5 : 0 }}
                    className="mt-2 flex items-center justify-center text-sm"
                  >
                    View details <FaArrowRight className="ml-1" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              onMouseEnter={() => setActiveCard('shared')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <Link
                to="/shared"
                className="relative block"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`bg-purple-100 p-6 rounded-xl shadow transition flex flex-col items-center text-purple-700 ${activeCard === 'shared' ? 'ring-4 ring-purple-300' : ''}`}
                >
                  <FaUsers className="text-3xl mb-2" />
                  <span className="font-semibold">Shared Budgets</span>
                  <motion.div 
                    animate={{ x: activeCard === 'shared' ? 5 : 0 }}
                    className="mt-2 flex items-center justify-center text-sm"
                  >
                    View details <FaArrowRight className="ml-1" />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard;