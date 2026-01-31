import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Trash2, Download, Eye, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import API_BASE_URL from '../config/api';

/**
 * Manage Notes Page
 * Admin interface for managing and uploading notes
 */
function ManageNotes() {
  const [isDragging, setIsDragging] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [notePrice, setNotePrice] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch teachers and notes in parallel for faster loading
      const [teachersRes, notesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/teachers`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/notes`, { credentials: 'include' })
      ]);
      
      const teachersData = await teachersRes.json();
      if (teachersData.success) {
        setTeachers(teachersData.data || []);
      }

      const notesData = await notesRes.json();
      if (notesData.success) {
        setNotesList(notesData.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (!selectedTeacher) {
      alert('Please select a teacher first!');
      return;
    }
    
    if (!noteTitle) {
      alert('Please enter a note title!');
      return;
    }
    
    if (!notePrice) {
      alert('Please enter a price!');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('teacherId', selectedTeacher);
      formData.append('title', noteTitle);
      formData.append('price', notePrice);
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/notes`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('Notes uploaded successfully!');
        setNoteTitle('');
        setNotePrice('');
        setSelectedTeacher('');
        fetchData(); // Refresh list
      } else {
        alert(data.message || 'Failed to upload notes');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Server error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/notes/${noteId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchData(); // Refresh list
          alert('Note deleted successfully!');
        } else {
          alert(data.message || 'Failed to delete note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
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
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Notes</h1>
          <p className="text-slate-600">Upload, view, and manage teacher notes</p>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-primary-600" />
            Upload Notes
          </h2>

          {/* Upload Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Teacher
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Choose a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} - {teacher.subject}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Note Title
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g., Chapter 1: Introduction"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={notePrice}
                onChange={(e) => setNotePrice(e.target.value)}
                placeholder="e.g., 99"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Drag & Drop Area */}
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            animate={{
              borderColor: isDragging ? '#a855f7' : '#e2e8f0',
              backgroundColor: isDragging ? '#faf5ff' : '#ffffff'
            }}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300'
            }`}
          >
            <motion.div
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-primary-600 font-semibold">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-primary-600' : 'text-slate-400'}`} />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {isDragging ? 'Drop your files here' : 'Drag & Drop files here'}
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Supports PDF, JPG, PNG files up to 10MB
                  </p>
                </>
              )}
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer inline-block"
                >
                  Browse Files
                </motion.span>
              </label>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <File className="w-5 h-5 mr-2 text-primary-600" />
              All Notes ({notesList.length})
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Note Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {notesList.length > 0 ? (
                  notesList.map((note, index) => {
                    const teacher = teachers.find(t => t._id === note.teacher?._id || t._id === note.teacher);
                    return (
                      <motion.tr
                        key={note._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              note.fileType === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {note.fileType === 'pdf' ? (
                                <File className="w-5 h-5 text-red-600" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <span className="font-medium text-slate-800">{note.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {note.teacher?.name || teacher?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            {note.subject || note.teacher?.subject || teacher?.subject || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 uppercase text-sm font-medium">
                            {note.fileType || 'image'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {note.videoUrl ? (
                            <div className="flex items-center justify-center">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                                {note.videoType || 'Video'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">No video</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(note._id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <File className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-medium">No notes found</p>
                        <p className="text-sm">Upload your first note to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default ManageNotes;
