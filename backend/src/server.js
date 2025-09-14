// src/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const auth = require('./middleware/auth'); // Import the auth middleware

const app = express();

// Trust proxy - required for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Simple CORS Configuration
app.use(cors({
  origin: true, // Allow all origins for simplicity
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/books', auth, bookRoutes);
app.use('/api/borrowers', auth, borrowerRoutes);
app.use('/api/borrowings', auth, borrowingRoutes);
app.use('/api/analytics', auth, analyticsRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});