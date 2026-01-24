import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User } from 'lucide-react';

/**
 * Topbar Component
 * Top navigation bar with admin profile and actions
 */
function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();
  
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-slate-200 shadow-sm z-30"
    >
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-800">Welcome, {user?.name?.split(' ')[0] || 'Admin'}</h2>
            <p className="hidden sm:block text-sm text-slate-500">Manage your platform efficiently</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          {/* Admin Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'admin@teachernotes.com'}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Topbar;
