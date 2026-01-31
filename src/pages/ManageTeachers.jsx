import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import Modal from '../components/admin/Modal';
import API_BASE_URL from '../config/api';

/**
 * Manage Teachers Page
 * Admin interface for managing teachers
 */
function ManageTeachers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    notesCount: 0,
    description: '',
    photo: null,
    photoPreview: null
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teachers`, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      if (response.ok && data.success) {
        setTeachersList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setFormData({ name: '', subject: '', notesCount: 0, description: '', photo: null, photoPreview: null });
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      notesCount: teacher.notesCount,
      description: teacher.description || '',
      photo: null,
      photoPreview: teacher.profileImage ? teacher.profileImage : null
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingTeacher 
        ? `${API_BASE_URL}/api/admin/teachers/${editingTeacher._id}`
        : `${API_BASE_URL}/api/admin/teachers`;
      const method = editingTeacher ? 'PUT' : 'POST';
      
      // Use FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('subject', formData.subject);
      submitData.append('description', formData.description);
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: submitData
      });
      
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      if (response.status === 403) {
        alert('Access denied. Admin privileges required.');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsModalOpen(false);
        fetchTeachers(); // Refresh list
        alert(editingTeacher ? 'Teacher updated successfully!' : 'Teacher added successfully!');
      } else {
        alert(data.message || 'Failed to save teacher');
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Server error. Please try again.');
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/teachers/${teacherId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchTeachers(); // Refresh list
          alert('Teacher deleted successfully!');
        } else {
          alert(data.message || 'Failed to delete teacher');
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Server error. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Teachers</h1>
            <p className="text-slate-600">Add, edit, or remove teachers from the platform</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddTeacher}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Teacher</span>
          </motion.button>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teachersList.map((teacher, index) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                {/* Profile */}
                <div className="flex justify-center mb-4">
                  {teacher.profileImage ? (
                    <img
                      src={teacher.profileImage}
                      alt={teacher.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-ocean-500 flex items-center justify-center shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center space-y-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{teacher.name}</h3>
                  <p className="text-sm text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full inline-block">
                    {teacher.subject}
                  </p>
                  <p className="text-xs text-slate-500">{teacher.notesCount} Notes</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditTeacher(teacher)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(teacher._id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teacher Photo
              </label>
              <div className="flex items-center space-x-4">
                {formData.photoPreview && (
                  <img
                    src={formData.photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-300"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        photo: file,
                        photoPreview: URL.createObjectURL(file)
                      });
                    }
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teacher Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Dr. John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mathematics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Expert teacher with years of experience..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                {editingTeacher ? 'Update' : 'Add'} Teacher
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}

export default ManageTeachers;
