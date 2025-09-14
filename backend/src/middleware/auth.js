// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const auth = async (req, res, next) => {
    try {
        let token = null;
        
        // First, check for token in cookies (preferred method)
        if (req.cookies && req.cookies['auth-token']) {
            token = req.cookies['auth-token'];
        }
        // Fallback to Authorization header for backward compatibility
        else {
            const authHeader = req.header('Authorization');

            // Check if the Authorization header is present
            if (!authHeader) {
                return res.status(401).json({ message: 'No authentication token provided' });
            }

            // Check if the auth scheme is Bearer (JWT token)
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.replace('Bearer ', '');
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
                return next();
            } else {
                return res.status(401).json({ message: 'Invalid auth scheme' });
            }
        }

        // If no token found at all
        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;