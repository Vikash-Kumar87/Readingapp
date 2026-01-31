import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

/**
 * AdminLayout Component
 * Main layout wrapper for admin dashboard with sidebar and topbar
 */
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // Default closed on mobile

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

