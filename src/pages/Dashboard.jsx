import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  Star,
  BarChart3,
  Calendar
} from 'lucide-react';
import { containerVariants, itemVariants } from '../animations/variants';
import API_BASE_URL from '../config/api';

/**
 * Dashboard Page
 * Student analytics and overview
 */
function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    purchasedNotes: 0,
    currentStreak: 0,
    longestStreak: 0,
    readingProgress: 0
  });
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/student`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
        setWeeklyActivity(data.data.weeklyActivity);
        setRecentActivity(data.data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, gradient }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-6 text-white cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-white/20 backdrop-blur-sm rounded-xl`}>
          <Icon className="w-8 h-8" />
        </div>
        <TrendingUp className="w-5 h-5 opacity-70" />
      </div>
      <h3 className="text-4xl font-bold mb-2">{value}</h3>
      <p className="text-white/90 font-medium">{title}</p>
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{user.name}</span>!
          </h1>
          <p className="text-slate-600">
            Here's your learning overview
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              <StatCard
                icon={BookOpen}
                title="Notes Purchased"
                value={stats.purchasedNotes}
                color="purple"
                gradient="from-purple-600 to-purple-800"
              />
              <StatCard
                icon={Award}
                title="Current Streak"
                value={`${stats.currentStreak} Days`}
                color="blue"
                gradient="from-blue-600 to-cyan-600"
              />
              <StatCard
                icon={Clock}
                title="Reading Progress"
                value={`${stats.readingProgress}%`}
                color="green"
                gradient="from-green-600 to-emerald-600"
              />
            </motion.div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly Progress */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-800">
                    Weekly Activity
                  </h2>
                </div>
                
                {/* Bar chart from backend data */}
                <div className="space-y-3">
                  {weeklyActivity.map((item, idx) => (
                    <div key={item.day} className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-slate-600">
                        {item.day}
                      </span>
                      <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.notes / 5) * 100}%` }}
                          transition={{ delay: idx * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        />
                      </div>
                      <span className="w-12 text-sm font-medium text-slate-600">
                        {item.notes}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-slate-800">
                    Recent Activity
                  </h2>
                </div>

                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                      >
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'debit' ? 'bg-red-100' :
                          'bg-green-100'
                        }`}>
                          <DollarSign className={`w-5 h-5 ${
                            activity.type === 'debit' ? 'text-red-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">
                            {activity.description}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-bold ${
                          activity.type === 'debit' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {activity.type === 'debit' ? '-' : '+'}₹{activity.amount}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">
                      No recent activity
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg flex flex-col items-center gap-2"
                >
                  <BookOpen className="w-8 h-8" />
                  <span>Browse Teachers</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/profile')}
                  className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg flex flex-col items-center gap-2"
                >
                  <Star className="w-8 h-8" />
                  <span>My Profile</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;

