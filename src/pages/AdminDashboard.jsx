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
    totalStudents: 0,
    totalTeachers: 0,
    totalNotes: 0,
    activeStudents: 0,
    totalRevenue: 0,
    newStudentsThisWeek: 0
  });
  const [topTeachers, setTopTeachers] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/analytics/admin`, {
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data.overview);
        setTopTeachers(data.data.topTeachers);
        setTopStudents(data.data.topStudents);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      count: stats.totalStudents.toString(),
      icon: Users,
      color: 'blue',
      trend: ((stats.newStudentsThisWeek / stats.totalStudents) * 100).toFixed(1)
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
      title: 'Total Revenue',
      count: `₹${stats.totalRevenue}`,
      icon: TrendingUp,
      color: 'pink',
      trend: 12
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-1 sm:mb-2">
              Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Overview</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600">Monitor your platform's performance and metrics</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-lg w-fit"
          >
            <p className="text-xs sm:text-sm font-semibold whitespace-nowrap">Last updated: Just now</p>
          </motion.div>
        </motion.div>

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
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              Top Rated Teachers
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {topTeachers.length > 0 ? (
                topTeachers.map((teacher) => (
                  <div key={teacher._id} className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">{teacher.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{teacher.name}</p>
                      <p className="text-xs text-slate-500 truncate">{teacher.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500 text-xs">⭐ {teacher.rating?.average?.toFixed(1) || 'N/A'}</span>
                        <span className="text-slate-400 text-xs">• {teacher.notesCount} notes</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4 text-sm">No teachers yet</p>
              )}
            </div>
          </motion.div>

          {/* Top Students Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Top Students
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {topStudents.length > 0 ? (
                topStudents.map((student) => (
                  <div key={student._id} className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl hover:shadow-md transition-all">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">{student.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{student.name}</p>
                      <p className="text-xs text-slate-500 truncate">{student.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-blue-600 text-xs font-medium">{student.purchasedNotes?.length || 0} purchases</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4 text-sm">No students yet</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-100 mt-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-xs text-slate-600 mb-1">Active Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.activeStudents}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <p className="text-xs text-slate-600 mb-1">New This Week</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.newStudentsThisWeek}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}

export default AdminDashboard;
