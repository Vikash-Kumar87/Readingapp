import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home as HomeIcon, LogOut } from 'lucide-react';

/**
 * Layout Component
 * Provides consistent header/navigation and page wrapper
 */
function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/dashboard';
  
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
    <div className="min-h-screen flex flex-col">
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
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {user && (
                <span className="hidden sm:inline-block text-sm text-white/90 font-medium drop-shadow">
                  Welcome, {user.name}
                </span>
              )}
              {!isHomePage && (
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
              )}
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
          </div>
        </div>
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-6 sm:mb-8">
            {/* About Section */}
            <div className="text-white">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
                <h3 className="text-lg sm:text-xl font-bold">Teacher Notes</h3>
              </div>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                Access high-quality handwritten notes from expert teachers. Learn at your own pace with our modern reading platform.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">Quick Links</h3>
              <ul className="space-y-3 text-sm sm:text-base">
                <li className="text-center sm:text-left">
                  <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors inline-flex items-center space-x-2 hover:translate-x-1 transform duration-200">
                    <span>→</span>
                    <span>Home</span>
                  </Link>
                </li>
                <li className="text-center sm:text-left">
                  <a href="#teachers" className="text-white/90 hover:text-white transition-colors inline-flex items-center space-x-2 hover:translate-x-1 transform duration-200">
                    <span>→</span>
                    <span>Teachers</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">Contact Us</h3>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <span className="text-white/90 text-lg">📧</span>
                  <a href="mailto:vikashkr30112003@gmail.com" className="text-white/90 hover:text-white transition-colors break-all">
                    vikashkr30112003@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <span className="text-white/90 text-lg">📱</span>
                  <a href="tel:+918789060869" className="text-white/90 hover:text-white transition-colors">
                    +91 8789060869
                  </a>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-white/80 mb-3 text-center sm:text-left">Follow Us</p>
                  <div className="flex justify-center sm:justify-start space-x-3">
                    <a href="#facebook" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-base font-bold">f</span>
                    </a>
                    <a href="#youtube" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-base">▶</span>
                    </a>
                    <a href="#instagram" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-base">📷</span>
                    </a>
                    <a href="https://www.linkedin.com/in/vikash-kumar89?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30 hover:scale-110 transform duration-200">
                      <span className="text-white text-base font-bold">in</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <p className="text-white/90 text-sm sm:text-base text-center">
                © 2026 Teacher Notes. All rights reserved.
              </p>
              <p className="text-white/80 text-sm sm:text-base text-center">
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
