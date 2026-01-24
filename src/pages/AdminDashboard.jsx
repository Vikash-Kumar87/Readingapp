import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, FileText, TrendingUp } from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import AdminLayout from '../layouts/AdminLayout';
import API_BASE_URL from '../config/api';

/**
 * Admin Dashboard Overview Page
 * Displays key statistics and metrics
 */
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalNotes: 0,
    activeSessions: 0
  });
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, teachersRes, notesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/teachers`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/notes`, { credentials: 'include' })
      ]);

      const usersData = await usersRes.json();
      const teachersData = await teachersRes.json();
      const notesData = await notesRes.json();

      if (usersData.success && teachersData.success && notesData.success) {
        setStats({
          totalUsers: usersData.data.length,
          totalTeachers: teachersData.data.length,
          totalNotes: notesData.data.length,
          activeSessions: 0 // Can be implemented later with session tracking
        });

        // Get recent 3 teachers
        setRecentTeachers(teachersData.data.slice(0, 3));
        
        // Get recent 3 notes
        setRecentNotes(notesData.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      count: stats.totalUsers.toString(),
      icon: Users,
      color: 'blue',
      trend: 12
    },
    {
      title: 'Total Teachers',
      count: stats.totalTeachers.toString(),
      icon: GraduationCap,
      color: 'green',
      trend: 5
    },
    {
      title: 'Total Notes',
      count: stats.totalNotes.toString(),
      icon: FileText,
      color: 'purple',
      trend: 18
    },
    {
      title: 'Active Sessions',
      count: stats.activeSessions.toString(),
      icon: TrendingUp,
      color: 'pink',
      trend: 8
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">Dashboard Overview</h1>
            <p className="text-sm sm:text-base text-slate-600">Monitor your platform's performance and metrics</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-lg w-fit"
          >
            <p className="text-xs sm:text-sm font-semibold whitespace-nowrap">Last updated: Just now</p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* Recent Teachers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600" />
              Recent Teachers
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {recentTeachers.length > 0 ? (
                recentTeachers.map((teacher, index) => (
                  <div key={teacher._id} className="flex items-center space-x-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">{teacher.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{teacher.name}</p>
                      <p className="text-xs text-slate-500 truncate">{teacher.subject}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4 text-sm">No teachers yet</p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-slate-200"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">Add New Teacher</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Upload Notes</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
