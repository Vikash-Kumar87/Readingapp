import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';
import API_BASE_URL from '../config/api';

/**
 * Color schemes for different teacher cards
 */
const colorSchemes = [
  { gradient: 'from-purple-500 via-pink-500 to-red-500', bg: 'from-purple-100 to-pink-100', border: 'from-purple-400 via-pink-400 to-red-400', text: 'text-purple-700', cardBg: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { gradient: 'from-blue-500 via-cyan-500 to-teal-500', bg: 'from-blue-100 to-cyan-100', border: 'from-blue-400 via-cyan-400 to-teal-400', text: 'text-blue-700', cardBg: 'bg-gradient-to-br from-emerald-500 to-green-600' },
  { gradient: 'from-emerald-500 via-green-500 to-lime-500', bg: 'from-emerald-100 to-green-100', border: 'from-emerald-400 via-green-400 to-lime-400', text: 'text-emerald-700', cardBg: 'bg-gradient-to-br from-purple-500 to-violet-600' },
  { gradient: 'from-amber-500 via-orange-500 to-red-500', bg: 'from-amber-100 to-orange-100', border: 'from-amber-400 via-orange-400 to-red-400', text: 'text-amber-700', cardBg: 'bg-gradient-to-br from-pink-500 to-rose-600' },
  { gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', bg: 'from-violet-100 to-purple-100', border: 'from-violet-400 via-purple-400 to-fuchsia-400', text: 'text-violet-700', cardBg: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', bg: 'from-rose-100 to-pink-100', border: 'from-rose-400 via-pink-400 to-fuchsia-400', text: 'text-rose-700', cardBg: 'bg-gradient-to-br from-teal-500 to-cyan-600' },
  { gradient: 'from-indigo-500 via-blue-500 to-cyan-500', bg: 'from-indigo-100 to-blue-100', border: 'from-indigo-400 via-blue-400 to-cyan-400', text: 'text-indigo-700', cardBg: 'bg-gradient-to-br from-orange-500 to-red-600' },
  { gradient: 'from-teal-500 via-emerald-500 to-green-500', bg: 'from-teal-100 to-emerald-100', border: 'from-teal-400 via-emerald-400 to-green-400', text: 'text-teal-700', cardBg: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
];

/**
 * TeacherCard Component
 * Displays teacher information with hover animations
 * @param {Object} teacher - Teacher data object
 */
function TeacherCard({ teacher }) {
  const navigate = useNavigate();
  // Use _id from MongoDB instead of id
  const teacherIndex = teacher._id ? parseInt(teacher._id.slice(-2), 16) : 0;
  const colors = colorSchemes[teacherIndex % colorSchemes.length];

  // Card hover animation variants
  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className={`${colors.cardBg} cursor-pointer relative group rounded-3xl shadow-2xl overflow-hidden`}
      onClick={() => navigate(`/teacher/${teacher._id}`)}
    >
      {/* Gradient border effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.border} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
      
      <div className="relative p-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative"
          >
            {teacher.profileImage ? (
              <img
                src={teacher.profileImage.startsWith('http') ? teacher.profileImage : `${API_BASE_URL}${teacher.profileImage}`}
                alt={teacher.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-glow"
              />
            ) : (
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center border-4 border-white shadow-glow`}>
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            {/* Online status indicator with pulse */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-1 right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full border-2 border-white shadow-lg"
            />
          </motion.div>
        </div>

        {/* Teacher Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
            {teacher.name}
          </h3>
          <p className="text-sm font-semibold px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full inline-block text-white">
            {teacher.subject}
          </p>
          <div className="flex items-center justify-center space-x-1 text-xs text-white/90 pt-2">
            <BookOpen className="w-4 h-4 text-white" />
            <span className="font-medium">{teacher.notesCount} Notes Available</span>
          </div>
        </div>

        {/* View Notes Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden border border-white/30"
        >
          <span className="relative z-10">View Notes</span>
        </motion.button>
      </div>

      {/* Decorative gradient overlay on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-white/10 rounded-3xl pointer-events-none"
      />
    </motion.div>
  );
}

export default TeacherCard;
