import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video as VideoIcon, Trash2, Eye } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import API_BASE_URL from '../config/api';

/**
 * Manage Videos Page
 * Admin interface for managing and uploading videos
 */
function ManageVideos() {
  const [videosList, setVideosList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('youtube');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch teachers and notes with videos in parallel
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
        // Filter only notes that have videos
        const videosOnly = (notesData.data || []).filter(note => note.videoUrl);
        setVideosList(videosOnly);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedTeacher) {
      alert('Please select a teacher first!');
      return;
    }
    
    if (!videoTitle) {
      alert('Please enter a video title!');
      return;
    }
    
    if (!videoUrl) {
      alert('Please enter a video URL!');
      return;
    }

    setUploading(true);
    
    try {
      // Create a note with video but with a placeholder file
      const formData = new FormData();
      formData.append('teacherId', selectedTeacher);
      formData.append('title', videoTitle);
      formData.append('price', '0'); // Default price for video-only content
      formData.append('videoUrl', videoUrl);
      formData.append('videoType', videoType);
      
      // Create a dummy file (1x1 transparent pixel) for video-only notes
      const blob = new Blob(['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='], { type: 'image/png' });
      const dummyFile = new File([blob], 'video-placeholder.png', { type: 'image/png' });
      formData.append('files', dummyFile);

      const response = await fetch(`${API_BASE_URL}/api/admin/notes`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('Video uploaded successfully!');
        setVideoTitle('');
        setVideoUrl('');
        setVideoType('youtube');
        setSelectedTeacher('');
        fetchData(); // Refresh list
      } else {
        alert(data.message || 'Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Server error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/notes/${noteId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchData(); // Refresh list
          alert('Video deleted successfully!');
        } else {
          alert(data.message || 'Failed to delete video');
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Server error. Please try again.');
      }
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Videos</h1>
          <p className="text-slate-600">Upload, view, and manage teacher videos</p>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-primary-600" />
            Upload Video
          </h2>

          {/* Upload Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Teacher <span className="text-red-500">*</span>
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
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g., Chapter 1: Introduction"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Video Section */}
          <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <VideoIcon className="w-6 h-6 mr-2 text-purple-600" />
                Video Details
              </h3>
              {selectedTeacher && (
                <div className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  For: {teachers.find(t => t._id === selectedTeacher)?.name || 'Select Teacher'}
                </div>
              )}
            </div>
            
            {!selectedTeacher ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please select a teacher first to add video
                </p>
              </div>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g., https://youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  disabled={!selectedTeacher}
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  {selectedTeacher 
                    ? `YouTube video link for ${teachers.find(t => t._id === selectedTeacher)?.name}'s ${teachers.find(t => t._id === selectedTeacher)?.subject} chapter`
                    : 'Select a teacher to add video'
                  }
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Video Type
                </label>
                <select
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                  disabled={!selectedTeacher}
                >
                  <option value="youtube">YouTube</option>
                  <option value="mp4">MP4 File</option>
                  <option value="webm">WebM File</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUploadVideo}
              disabled={uploading || !selectedTeacher || !videoTitle || !videoUrl}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Video
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Videos List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <VideoIcon className="w-5 h-5 mr-2 text-primary-600" />
              All Videos ({videosList.length})
            </h2>
          </div>

          {/* Videos Grid */}
          <div className="p-6">
            {videosList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videosList.map((video, index) => {
                  const teacher = teachers.find(t => t._id === video.teacher?._id || t._id === video.teacher);
                  return (
                    <motion.div
                      key={video._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border-2 border-purple-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative bg-slate-900" style={{ paddingBottom: '56.25%' }}>
                        {video.videoType === 'youtube' ? (
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.videoUrl)}?rel=0&modestbranding=1`}
                            title={video.title}
                            frameBorder="0"
                            sandbox="allow-same-origin allow-scripts allow-presentation"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <video
                            controls
                            className="absolute top-0 left-0 w-full h-full"
                            controlsList="nodownload"
                          >
                            <source src={video.videoUrl} type={`video/${video.videoType}`} />
                          </video>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {teacher?.name || 'Unknown'}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {video.videoType === 'youtube' ? 'YouTube' : video.videoType?.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm font-semibold"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(video._id)}
                            className="flex-1 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm font-semibold"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <VideoIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-semibold mb-2">No Videos Yet</p>
                <p className="text-slate-500">Upload your first video to get started</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default ManageVideos;
