import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import TeacherNotes from './pages/TeacherNotes';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageTeachers from './pages/ManageTeachers';
import ManageNotes from './pages/ManageNotes';
import Settings from './pages/Settings';
import AdminLayout from './layouts/AdminLayout';

/**
 * Protected Route Component for User Routes
 */
const ProtectedRoute = ({ children }) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      return <Navigate to="/register" replace />;
    }
    
    if (user.isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    
    return children;
  } catch (error) {
    localStorage.removeItem('user');
    return <Navigate to="/register" replace />;
  }
};

/**
 * Protected Route Component for Admin Routes
 */
const AdminRoute = ({ children }) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      return <Navigate to="/register" replace />;
    }
    
    if (!user.isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  } catch (error) {
    localStorage.removeItem('user');
    return <Navigate to="/register" replace />;
  }
};

/**
 * Auth Route Component - Redirects logged in users
 */
const AuthRoute = ({ children }) => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user) {
      if (user.isAdmin) {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  } catch (error) {
    localStorage.removeItem('user');
    return children;
  }
};

/**
 * Main App Component
 * Handles routing and page transitions
 */
function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Default Route - Register Page */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          
          {/* User Routes - Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
          <Route path="/teacher/:id" element={<ProtectedRoute><Layout><TeacherNotes /></Layout></ProtectedRoute>} />
          <Route path="/payment/:teacherId" element={<ProtectedRoute><Layout><Payment /></Layout></ProtectedRoute>} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/teachers" element={<AdminRoute><ManageTeachers /></AdminRoute>} />
          <Route path="/admin/notes" element={<AdminRoute><ManageNotes /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
