# Library Management System

A full-stack web application for managing library operations including books, borrowers, and borrowing processes.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Port 3001)   │◄──►│   (Port 3000)   │◄──►│   (Port 3306)   │
│   Next.js/React │    │  Node.js/Express│    │   MySQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Development
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production
```bash
docker-compose up --build
```

## 📱 Access Points

- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Database**: localhost:3306

## 🔧 Key Features

- **Books Management**: Add, edit, delete, and search books
- **Borrowers Management**: Manage library member information
- **Borrowing System**: Track book checkouts and returns
- **Analytics Dashboard**: View borrowing statistics and trends
- **Secure Authentication**: HTTP-only cookie-based JWT authentication system
- **Enhanced Security**: XSS protection with HTTP-only cookies, CSRF protection
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **Next.js 13+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Chart.js** - Data visualization
- **Headless UI** - Accessible components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **HTTP-only Cookies** - Secure token storage
- **Swagger** - API documentation
- **CORS** - Cross-origin resource sharing with credentials support

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── lib/            # Redux store and utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── config/         # Configuration files
│   ├── .env.local          # Environment variables
│   └── package.json
│
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Database and app configuration
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
└── README.md               # This file
```

## 🔄 Service Management

### Individual Services

**Start Backend Only:**
```bash
docker-compose up backend db
```

**Start Frontend Only:**
```bash
docker-compose up frontend
```

**View Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔐 Environment Configuration

The application uses a single environment file for simplicity:

**Frontend (`.env.local`):**
```bash
# API Configuration - Works for both development and production
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (sets HTTP-only cookie)
- `POST /api/auth/logout` - User logout (clears authentication cookie)
- `GET /api/auth/me` - Get current authenticated user
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/users` - Get all users 
- `DELETE /api/auth/users/:id` - Delete a user

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Borrowers
- `GET /api/borrowers` - Get all borrowers
- `POST /api/borrowers` - Add new borrower
- `PUT /api/borrowers/:id` - Update borrower
- `DELETE /api/borrowers/:id` - Delete borrower

### Borrowings
- `GET /api/borrowings` - Get all borrowings
- `POST /api/borrowings/checkout` - Checkout book
- `PUT /api/borrowings/:id/return` - Return book

### Analytics
- `GET /api/analytics` - Get borrowing analytics

## 🔐 Authentication & Security

### HTTP-only Cookie Authentication

The application uses HTTP-only cookies for secure authentication, providing enhanced security compared to localStorage-based token storage.

#### Security Features
- **HTTP-only Cookies**: Tokens stored in HTTP-only cookies, inaccessible to JavaScript
- **XSS Protection**: Client-side scripts cannot access authentication tokens
- **CSRF Protection**: SameSite cookie attribute prevents cross-site request forgery
- **Automatic Expiration**: Cookies expire after 24 hours for security
- **Secure Transmission**: Cookies only sent over HTTPS in production

#### Authentication Flow
1. **Login**: User submits credentials → Server validates → Sets HTTP-only cookie
2. **Requests**: Browser automatically sends cookie with each request
3. **Validation**: Server validates cookie on protected routes
4. **Logout**: Server clears the authentication cookie

#### Cookie Configuration
```javascript
// Backend cookie settings
res.cookie('auth-token', token, {
  httpOnly: true,                              // Prevent XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',                         // CSRF protection
  maxAge: 24 * 60 * 60 * 1000,               // 24 hours
  path: '/'                                   // Available site-wide
});
```

#### Frontend Integration
- **Automatic Cookie Handling**: Axios configured with `withCredentials: true`
- **No Token Management**: No localStorage or manual token handling required
- **Session Persistence**: Authentication persists across browser sessions
- **Automatic Logout**: Cookies expire automatically for security

## 🚨 Troubleshooting

### Common Issues

**1. Port Already in Use:**
```bash
# Stop all Docker containers
docker-compose down

# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

**2. Database Connection Issues:**
```bash
# Reset database volume
docker-compose down -v
docker-compose up --build
```

**3. Frontend Not Loading:**
- Check if backend is running on port 3000
- Verify environment variables in `.env.local`
- Clear browser cache

**4. Authentication Issues:**
- Verify cookies are being sent with requests (`withCredentials: true`)
- Check CORS configuration allows credentials
- Confirm JWT_SECRET is set in environment variables
- Ensure cookie-parser middleware is installed and configured

**5. API Calls Failing:**
- Verify CORS configuration in backend allows credentials
- Check network connectivity between containers
- Confirm authentication cookie is valid and not expired

## 🔄 Development Workflow

1. **Make Changes**: Edit code in `frontend/` or `backend/`
2. **Hot Reload**: Development containers automatically reload
3. **Test**: Access application at http://localhost:3001
4. **Debug**: Use `docker-compose logs -f [service]` for debugging
