import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Home as HomeIcon, LogOut, LayoutDashboard, User, Menu, X } from 'lucide-react';

/**
 * Layout Component
 * Provides consistent header/navigation and page wrapper
 */
function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/dashboard';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 shadow-2xl sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-1.5 sm:space-x-2 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30"
              >
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <span className="text-base sm:text-xl font-bold text-white drop-shadow-lg">
                Teacher Notes
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2 sm:space-x-4">
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-sm text-white/90 font-medium drop-shadow">
                    {user.name}
                  </span>
                </div>
              )}
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md text-white rounded-lg sm:rounded-xl hover:bg-white/30 transition-all font-semibold shadow-lg border border-white/30 text-sm sm:text-base"
                >
                  <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Home</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md text-white rounded-lg sm:rounded-xl hover:bg-white/30 transition-all font-semibold shadow-lg border border-white/30 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 border-t border-white/20"
            >
              <div className="px-4 py-3 space-y-2">
                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                )}

                {/* Home */}
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all font-semibold shadow-lg border border-white/30"
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span>Home</span>
                  </motion.button>
                </Link>

                {/* Logout */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all font-semibold shadow-lg border border-white/30"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-black mt-auto overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/footer-banner.jpg" 
            alt="Footer Banner" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="text-white text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-xl font-bold">Teacher Notes</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Access high-quality handwritten notes from expert teachers. Learn at your own pace with our modern reading platform.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-white text-center md:text-left">
              <h3 className="text-xl font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors inline-flex items-center space-x-2 hover:translate-x-1 transform duration-200">
                    <span>→</span>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <a href="#teachers" className="text-white/90 hover:text-white transition-colors inline-flex items-center space-x-2 hover:translate-x-1 transform duration-200">
                    <span>→</span>
                    <span>Teachers</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-white text-center md:text-left">
              <h3 className="text-xl font-bold mb-3">Contact Us</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="text-lg">📧</span>
                  <a href="mailto:randhir15401@gmail.com" className="text-white/90 hover:text-white transition-colors truncate max-w-[200px]">
                    randhir15401@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="text-lg">📱</span>
                  <a href="tel:+919835249335" className="text-white/90 hover:text-white transition-colors">
                    +91 9835249335
                  </a>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-white/80 mb-2">Follow Us</p>
                  <div className="flex justify-center md:justify-start space-x-2">
                    <a href="https://www.facebook.com/share/1H7eKyky77/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-sm font-bold">f</span>
                    </a>
                    <a href="https://youtube.com/@r.vision1664?si=QTiMVUw8boQPZf0h" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-sm">▶</span>
                    </a>
                    <a href="https://www.instagram.com/invites/contact/?igsh=5atg6qvcw95r&utm_content=zp4gj3i" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-sm">📷</span>
                    </a>
                    <a href="https://www.linkedin.com/in/vikash-kumar89?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-sm font-bold">in</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/20">
            <div className="flex flex-col items-center space-y-2 text-center">
              <p className="text-white/90 text-xs sm:text-sm">
                © 2026 Teacher Notes. All rights reserved.
              </p>
              <p className="text-white/80 text-xs sm:text-sm">
                Made with ❤️ for better education
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
