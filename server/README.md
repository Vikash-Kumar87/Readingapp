# Teacher Notes Backend API

Simple backend server for Teacher Notes Application with session-based authentication.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
MongoDB should be running automatically

# Or start manually
mongod
```

### 3. Configure Environment
The `.env` file is already configured with:
- PORT: 5000
- MONGODB_URI: mongodb://localhost:27017/readingappDB
- SESSION_SECRET: mysecretkey123changethis

### 4. Seed Database
Create admin user and sample data:
```bash
npm run seed
```

### 5. Start Server
```bash
npm run dev
```

Server will run at: **http://localhost:5000**

## 📋 Default Login Credentials

### Admin Account
- **Email**: admin@teachernotes.com
- **Password**: admin123

### Test User Account
- **Email**: user@test.com
- **Password**: user123

## 📍 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user

### Teachers (`/api/teachers`)
- `GET /` - Get all teachers (public)
- `GET /:id` - Get single teacher (public)
- `POST /` - Create teacher (admin only)
- `PUT /:id` - Update teacher (admin only)
- `DELETE /:id` - Delete teacher (admin only)

### Notes (`/api/notes`)
- `GET /` - Get all notes (public)
- `GET /subject/:subject` - Get notes by subject (public)
- `GET /:id` - Get single note (public)
- `POST /` - Create note (admin only, supports file upload)
- `PUT /:id` - Update note (admin only)
- `DELETE /:id` - Delete note (admin only)
- `POST /purchase/:id` - Purchase note (authenticated users)

### Admin (`/api/admin`)
- `GET /stats` - Get dashboard statistics (admin only)
- `GET /users` - Get all users (admin only)

## 📝 API Usage Examples

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@teachernotes.com",
  "password": "admin123"
}
```

### Get All Teachers
```bash
GET http://localhost:5000/api/teachers
```

### Create Teacher (Admin Only)
```bash
POST http://localhost:5000/api/teachers
Content-Type: application/json
Cookie: connect.sid=<session-cookie>

{
  "name": "Dr. John Smith",
  "subject": "Mathematics",
  "description": "Expert mathematician"
}
```

### Purchase Note
```bash
POST http://localhost:5000/api/notes/purchase/<note-id>
Cookie: connect.sid=<session-cookie>
```

### Get Admin Stats
```bash
GET http://localhost:5000/api/admin/stats
Cookie: connect.sid=<session-cookie>
```

## 🔒 Authentication

This API uses **simple session-based authentication**:
- No JWT tokens
- Session stored in memory (express-session)
- Passwords hashed with bcrypt
- Cookie-based session management

### Session Info Stored:
- `userId` - User's MongoDB ID
- `isAdmin` - Boolean flag
- `name` - User's name

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── models/
│   ├── User.js                # User model
│   ├── Teacher.js             # Teacher model
│   └── Note.js                # Note model
├── controllers/
│   ├── auth.controller.js     # Authentication logic
│   ├── admin.controller.js    # Admin operations
│   ├── teacher.controller.js  # Teacher CRUD
│   └── note.controller.js     # Note CRUD
├── routes/
│   ├── auth.routes.js         # Auth routes
│   ├── admin.routes.js        # Admin routes
│   ├── teacher.routes.js      # Teacher routes
│   └── note.routes.js         # Note routes
├── middleware/
│   ├── auth.middleware.js     # Check login
│   └── admin.middleware.js    # Check admin
├── uploads/                   # Uploaded files
├── .env                       # Environment variables
├── server.js                  # Main server file
├── seed.js                    # Database seeder
└── package.json
```

## 🗄️ Database Models

### User
- name, email, password (hashed)
- isAdmin (Boolean)
- purchasedNotes (Array of Note IDs)

### Teacher
- name, subject, profileImage
- description, notesCount

### Note
- title, subject, teacher (ref)
- fileUrl, fileType (pdf/image)
- price, isPaid

## 🛠️ Features

✅ Simple session-based authentication
✅ Password hashing with bcrypt
✅ File upload support with Multer
✅ CORS enabled for frontend
✅ MongoDB with Mongoose
✅ Clean error handling
✅ Admin and user roles
✅ Purchase tracking
✅ Sample data seeder

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **express-session** - Session management
- **bcrypt** - Password hashing
- **multer** - File uploads
- **cors** - CORS support
- **dotenv** - Environment variables

## 🔧 Development

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start

# Seed database
npm run seed
```

## ⚠️ Important Notes

- This is a **simple authentication system** for learning purposes
- Session is stored in memory (resets on server restart)
- For production, use:
  - MongoDB session store
  - HTTPS
  - Secure cookies
  - JWT tokens (optional)
  - Rate limiting
  - Input validation

## 🧪 Testing

Use **Postman** or **Thunder Client** to test APIs:
1. Login to get session cookie
2. Cookie is automatically sent with subsequent requests
3. Test protected routes (admin/purchase)

## 📝 License

For educational purposes.

---

**Happy Coding! 🚀**
