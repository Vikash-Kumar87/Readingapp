const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for teacher photos
const teacherStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reading-app/teachers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Storage for notes (PDFs and images)
const noteStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    return {
      folder: 'reading-app/notes',
      allowed_formats: isPDF ? ['pdf'] : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      resource_type: isPDF ? 'raw' : 'image'
    };
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'), false);
  }
};

// Upload middleware for teachers
const uploadTeacherPhoto = multer({
  storage: teacherStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Upload middleware for notes
const uploadNoteFiles = multer({
  storage: noteStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = {
  cloudinary,
  uploadTeacherPhoto,
  uploadNoteFiles
};
