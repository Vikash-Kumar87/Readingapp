import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Lock, 
  Eye, 
  User, 
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { containerVariants, itemVariants } from '../animations/variants';
import API_BASE_URL from '../config/api';

/**
 * TeacherNotes Page Component
 * Displays teacher details and note previews with read-only/download options
 */
function TeacherNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNote, setSelectedNote] = useState(null); // null = list view, object = note viewer
  const [currentPage, setCurrentPage] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    fetchTeacherAndNotes();
  }, [id]);

  const fetchTeacherAndNotes = async () => {
    try {
      // Fetch teacher details
      const teacherResponse = await fetch(`${API_BASE_URL}/api/teachers/${id}`, {
        credentials: 'include'
      });
      const teacherData = await teacherResponse.json();

      if (!teacherResponse.ok || !teacherData.success) {
        setError('Teacher not found');
        setLoading(false);
        return;
      }

      setTeacher(teacherData.data);

      // Fetch notes for this teacher
      const notesResponse = await fetch(`${API_BASE_URL}/api/notes/teacher/${id}`, {
        credentials: 'include'
      });
      const notesData = await notesResponse.json();

      if (notesResponse.ok && notesData.success) {
        setNotes(notesData.data || []);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load teacher information');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading teacher...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || 'Teacher not found'}</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Navigate between note pages
  const nextPage = () => {
    if (currentPage < notes.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownload = () => {
    if (!isReadOnly) {
      navigate(`/payment/${teacher._id}`);
    }
  };

  const openNote = (note, index) => {
    console.log('Opening note:', note); // Debug log
    setSelectedNote(note);
    setCurrentPage(index);
  };

  const closeNoteViewer = () => {
    setSelectedNote(null);
    setCurrentPage(0);
  };

  // If a note is selected, show the viewer
  if (selectedNote) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.1, 0.05, 0.1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-300 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          {/* Back button and title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <motion.button
              onClick={closeNoteViewer}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl text-white hover:bg-white/30 transition-all border border-white/30 shadow-lg mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Back to Notes List</span>
            </motion.button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg px-1">{selectedNote.title}</h1>
          </motion.div>

          {/* Notes Viewer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/50"
          >
            {/* Control Buttons */}
            <div className="p-3 sm:p-4 md:p-6 border-b-2 border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  <span>Handwritten Notes</span>
                </motion.h2>
                
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                  {/* Read Only Button (Active) */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl border-2 border-white/50 text-xs sm:text-sm md:text-base flex-1 sm:flex-initial"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Read Only</span>
                  </motion.button>

                  {/* Download Button (Locked) */}
                  <button
                    onClick={handleDownload}
                    className="relative flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold bg-gradient-to-r from-slate-300 to-slate-400 text-slate-600 shadow-lg hover:shadow-xl border-2 border-white/50 group overflow-hidden cursor-pointer transition-shadow duration-300 text-xs sm:text-sm md:text-base flex-1 sm:flex-initial"
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:opacity-0 transition-opacity duration-300" />
                    <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">Download</span>
                    
                    {/* Hover overlay for locked state */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center space-x-2 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out">
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <span className="text-white font-semibold">Unlock Now</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Note Display Area - Responsive */}
            <div className="relative bg-white min-h-[500px]">
              {selectedNote && selectedNote.fileUrl ? (
                <div className="w-full bg-white">
                  {selectedNote.fileType === 'pdf' ? (
                    // PDF Viewer - Mobile Optimized
                    <div className="relative w-full bg-white" style={{ height: '600px' }}>
                      <object
                        data={`${API_BASE_URL}${selectedNote.fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`}
                        type="application/pdf"
                        className="w-full h-full"
                        style={{ pointerEvents: isReadOnly ? 'none' : 'auto' }}
                      >
                        <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                          <FileText className="w-16 h-16 text-purple-600 mb-4" />
                          <p className="text-lg font-semibold text-slate-700 mb-2">PDF Viewer Not Supported</p>
                          <p className="text-sm text-slate-500 mb-6 text-center">Your browser doesn't support embedded PDFs. Please use Chrome, Safari, or Edge for best experience.</p>
                          {!isReadOnly && (
                            <button
                              onClick={() => window.open(`${API_BASE_URL}${selectedNote.fileUrl}`, '_blank')}
                              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                              <Eye className="w-5 h-5" />
                              <span>Open in New Tab</span>
                            </button>
                          )}
                        </div>
                      </object>
                      {/* Overlay to prevent right-click and download */}
                      {isReadOnly && (
                        <div 
                          className="absolute inset-0 bg-transparent"
                          onContextMenu={(e) => e.preventDefault()}
                          style={{ 
                            pointerEvents: 'auto',
                            userSelect: 'none',
                            WebkitTouchCallout: 'none'
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    // Image Viewer - Responsive
                    <div className="bg-white p-4 min-h-[500px]">
                      <img
                        src={`${API_BASE_URL}${selectedNote.fileUrl}`}
                        alt={selectedNote.title}
                        className="w-full h-auto max-w-full mx-auto rounded-xl shadow-2xl"
                        style={{ display: 'block' }}
                        onLoad={() => console.log('Image loaded successfully')}
                        onError={(e) => {
                          console.error('Image load error:', selectedNote.fileUrl);
                          e.target.src = 'https://via.placeholder.com/800x600?text=File+Not+Found';
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Fallback if no file
                <div className="bg-red-100 p-8 min-h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-600 text-lg font-bold mb-2">Note data missing!</p>
                    <p className="text-red-500 text-sm">Selected Note: {selectedNote ? 'exists' : 'null'}</p>
                    <p className="text-red-500 text-sm">File URL: {selectedNote?.fileUrl || 'missing'}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
    >
      <div className="max-w-6xl mx-auto">
        {/* Teacher Profile Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 25px 50px rgba(147, 51, 234, 0.3)" }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 md:mb-8 border-2 border-white/60 backdrop-blur-sm"
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl transform translate-x-32 -translate-y-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-300 to-purple-300 rounded-full blur-3xl transform -translate-x-32 translate-y-32 animate-pulse"></div>
          </div>

          <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
              {/* Profile Image with Animation */}
              <motion.div 
                className="flex-shrink-0 relative group"
                whileHover={{ scale: 1.08, rotate: 3, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                {teacher.profileImage ? (
                  <img
                    src={`${API_BASE_URL}${teacher.profileImage}`}
                    alt={teacher.name}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-purple-200 transform transition-transform"
                    style={{ transform: 'perspective(1000px) rotateY(-5deg)' }}
                  />
                ) : (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center border-4 border-white shadow-2xl ring-4 ring-purple-200 transform" style={{ transform: 'perspective(1000px) rotateY(-5deg)' }}>
                    <User className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
                  </div>
                )}
              </motion.div>

              {/* Teacher Details */}
              <div className="flex-1 text-center sm:text-left space-y-3 sm:space-y-4">
                {/* Name with gradient */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-800 via-purple-800 to-pink-700 bg-clip-text text-transparent leading-tight"
                >
                  {teacher.name}
                </motion.h1>
                
                {/* Subject and Notes with modern badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-white/30"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="font-semibold text-white text-sm sm:text-base">{teacher.subject}</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-white/30"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="font-semibold text-white text-sm sm:text-base">{notes.length} Notes Available</span>
                  </motion.div>
                </motion.div>
                
                {/* Enhanced Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2"
                >
                  <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-l-4 border-purple-400 shadow-sm">
                    <div className="absolute top-2 right-2 text-purple-300 opacity-40">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed font-medium relative z-10">
                      {teacher.description ? (
                        <>
                          {teacher.description.split(teacher.name).map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part.split(teacher.subject).map((subPart, j, subArr) => (
                                <React.Fragment key={j}>
                                  {subPart}
                                  {j < subArr.length - 1 && <span className="text-pink-600 font-semibold">{teacher.subject}</span>}
                                </React.Fragment>
                              ))}
                              {i < arr.length - 1 && <span className="text-purple-700 font-bold">{teacher.name}</span>}
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        <>
                          <span className="text-purple-700 font-bold">{teacher.name}</span> {' '}
                          <span className="text-pink-600 font-semibold">{teacher.subject}</span> {' '}
                          <span className="font-semibold"></span>. 
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        </motion.div>

        {/* Notes Viewer Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-pink-50/40 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/60 backdrop-blur-sm"
        >
          {/* Notes List Header */}
          <div className="p-3 sm:p-4 md:p-6 border-b-2 border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent flex items-center space-x-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              <span className="truncate">{teacher.name}'s {teacher.subject} Notes</span>
            </h2>
          </div>

          {/* Notes List */}
          <div className="p-3 sm:p-4 md:p-6">
            {notes.length === 0 ? (
              <div className="text-center py-12 sm:py-16 md:py-20 px-4">
                <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg sm:text-xl font-semibold mb-2">No Notes Available Yet</p>
                <p className="text-slate-500 text-sm sm:text-base">This teacher hasn't uploaded any notes yet. Check back soon!</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-6 px-4 sm:px-6 py-2 bg-indigo-600 text-white text-sm sm:text-base rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Other Teachers
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {notes.map((note, index) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openNote(note, index)}
                    className="flex items-center bg-white/80 backdrop-blur-sm border-2 border-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-purple-300 hover:shadow-lg hover:bg-white transition-all cursor-pointer group"
                  >
                    {/* Number Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center font-bold text-white mr-2 sm:mr-3 md:mr-4 text-sm sm:text-base ${
                      index % 9 === 0 ? 'bg-purple-500' :
                      index % 9 === 1 ? 'bg-orange-500' :
                      index % 9 === 2 ? 'bg-pink-500' :
                      index % 9 === 3 ? 'bg-blue-900' :
                      index % 9 === 4 ? 'bg-yellow-500' :
                      index % 9 === 5 ? 'bg-green-500' :
                      index % 9 === 6 ? 'bg-blue-500' :
                      index % 9 === 7 ? 'bg-gray-800' :
                      'bg-gray-500'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Note Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {note.title}
                      </h3>
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TeacherNotes;
