// src/server.js
const express = require('express');
const cors = require('cors');
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

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/books', auth, bookRoutes);
app.use('/api/borrowers', auth, borrowerRoutes);
app.use('/api/borrows', auth, borrowingRoutes);
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