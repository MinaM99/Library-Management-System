# Library Management System

A full-stack web application for managing library operations including books, borrowers, and borrowing processes.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Port 3001)   │◄──►│   (Port 3000)   │◄──►│   (Port 3306)   │
│   Next.js/React │    │   Node.js/Express│    │   MySQL         │
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
- **Authentication**: Secure login system
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
- **JWT** - Authentication
- **Swagger** - API documentation
- **CORS** - Cross-origin resource sharing

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

### Scaling Services

**Scale Backend:**
```bash
docker-compose up --scale backend=2
```

**Scale Frontend:**
```bash
docker-compose up --scale frontend=2
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
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

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

**4. API Calls Failing:**
- Verify CORS configuration in backend
- Check network connectivity between containers
- Confirm JWT token is valid

## 🔄 Development Workflow

1. **Make Changes**: Edit code in `frontend/` or `backend/`
2. **Hot Reload**: Development containers automatically reload
3. **Test**: Access application at http://localhost:3001
4. **Debug**: Use `docker-compose logs -f [service]` for debugging

## 🏗️ Production Deployment

The application is production-ready with:
- ✅ Optimized Docker images
- ✅ Environment-based configuration
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Independent service scaling

## 📝 License

This project is for educational/development purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---
