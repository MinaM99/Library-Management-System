// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        // Check if the Authorization header is present
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        // Check if the auth scheme is Bearer (JWT token)
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        // Check if the auth scheme is Basic
        else if (authHeader.startsWith('Basic ')) {
            const credentials = authHeader.replace('Basic ', '');
            const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf8');
            const [email, password] = decodedCredentials.split(':');

            // Verify the Basic Auth credentials
            const user = await User.findByEmail(email);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid Basic Auth credentials' });
            }
            req.user = user;
        } else {
            return res.status(401).json({ message: 'Invalid auth scheme' });
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;