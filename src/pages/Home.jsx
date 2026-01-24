import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import TeacherCard from '../components/TeacherCard';
import { containerVariants, itemVariants } from '../animations/variants';
import API_BASE_URL from '../config/api';

/**
 * Home Page Component
 * Displays grid of teacher cards with search functionality
 */
function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch teachers from API
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        // Backend returns {success, count, data: teachers[]}
        setTeachers(data.data || []);
      } else {
        setError('Failed to load teachers');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Server error. Please try again.');
      setTeachers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Filter teachers based on search
  const filteredTeachers = Array.isArray(teachers) ? teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8 sm:mb-12 relative"
        >
          {/* Decorative floating elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-6 sm:-top-10 left-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-2xl opacity-30"
          />
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -top-4 sm:-top-5 right-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full blur-2xl opacity-30"
          />
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-3 sm:mb-4 px-2"
          >
            Discover Your
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500"
            >
              Teacher's Notes
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Access high-quality handwritten notes from expert teachers. 
            <span className="block mt-1 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Learn at your own pace with our modern reading experience.</span>
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          variants={itemVariants}
          className="max-w-xl mx-auto mb-8 sm:mb-12 px-2"
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500" />
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </motion.div>
              <input
                type="text"
                placeholder="Search teacher or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-purple-200/50
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         text-sm sm:text-base text-slate-800 placeholder-slate-400 shadow-2xl font-medium transition-all duration-300
                         hover:shadow-purple-200/50"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="text-center py-12 sm:py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-sm sm:text-base text-slate-600">Loading teachers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <p className="text-red-600 text-base sm:text-lg">{error}</p>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredTeachers.map((teacher) => (
              <motion.div key={teacher._id} variants={itemVariants}>
                <TeacherCard teacher={teacher} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <div className="text-slate-400 mb-4">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-600 mb-2">
              No teachers found
            </h3>
            <p className="text-sm sm:text-base text-slate-500">
              Try adjusting your search terms
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Home;
