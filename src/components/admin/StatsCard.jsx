import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatsCard Component
 * Displays statistics with icon and count
 */
function StatsCard({ title, count, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-cyan-600',
      icon: 'bg-blue-100 text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'from-emerald-500 to-green-600',
      icon: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-200'
    },
    purple: {
      bg: 'from-purple-500 to-violet-600',
      icon: 'bg-purple-100 text-purple-600',
      border: 'border-purple-200'
    },
    pink: {
      bg: 'from-pink-500 to-rose-600',
      icon: 'bg-pink-100 text-pink-600',
      border: 'border-pink-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group"
    >
      {/* Gradient top bar */}
      <div className={`h-2 bg-gradient-to-r ${colors.bg}`} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.icon} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              +{trend}%
            </span>
          )}
        </div>
        
        <div>
          <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{count}</p>
        </div>
      </div>

      {/* Animated bottom effect */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        className={`h-1 bg-gradient-to-r ${colors.bg} origin-left`}
      />
    </motion.div>
  );
}

export default StatsCard;
