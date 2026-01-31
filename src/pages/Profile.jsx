import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Camera, BookOpen, Award, Calendar } from 'lucide-react';
import { containerVariants, itemVariants } from '../animations/variants';
import API_BASE_URL from '../config/api';

/**
 * Profile Page
 * User profile management
 */
function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [imagePreview, setImagePreview] = useState(user.profileImage || null);
  const fileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [stats, setStats] = useState({
    purchasedNotes: 0,
    joinedDate: user.createdAt || new Date()
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Fetch user stats
      const notesRes = await fetch(`${API_BASE_URL}/api/notes/purchased`, { credentials: 'include' });
      
      if (notesRes.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const notesData = await notesRes.json();

      setStats(prev => ({
        ...prev,
        purchasedNotes: notesData.count || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please upload an image file' });
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    // Check if any changes were made
    const hasNameChanged = formData.name !== user.name;
    const hasEmailChanged = formData.email !== user.email;
    const hasPasswordChanged = formData.newPassword !== '';
    const hasImageChanged = profileImage instanceof File;

    if (!hasNameChanged && !hasEmailChanged && !hasPasswordChanged && !hasImageChanged) {
      setMessage({ type: 'error', text: 'No changes made to update' });
      setSaving(false);
      setEditing(false);
      return;
    }

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        setSaving(false);
        return;
      }
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required' });
        setSaving(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);

      if (profileImage && profileImage instanceof File) {
        formDataToSend.append('profileImage', profileImage);
      }

      if (formData.newPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        // Update local storage
        const updatedUser = { 
          ...user, 
          name: formData.name, 
          email: formData.email,
          profileImage: data.data.profileImage || user.profileImage
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        if (data.data.profileImage) {
          setImagePreview(data.data.profileImage);
        }
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} rounded-2xl shadow-xl p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-white/90 font-medium">{label}</p>
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-3">
            My Profile
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600">
            Manage your account settings
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-xl overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-purple-600" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <motion.button
                  type="button"
                  onClick={handleCameraClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="pt-20 px-8 pb-8">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">
                      Change Password (Optional)
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {editing ? (
                  <>
                    <motion.button
                      type="submit"
                      disabled={saving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setMessage({ type: '', text: '' });
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setEditing(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Edit Profile
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            icon={BookOpen}
            label="Notes Purchased"
            value={stats.purchasedNotes}
            color="from-purple-600 to-purple-800"
          />
          <StatCard
            icon={Calendar}
            label="Member Since"
            value={new Date(stats.joinedDate).getFullYear()}
            color="from-blue-600 to-cyan-600"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;

