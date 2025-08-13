const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const { username, password, role } = req.body;

            // Validate required fields
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            // Check if username already exists
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Create user
            const userId = await User.create({
                username,
                password,
                role
            });

            const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });

            res.status(201).json({
                message: 'User registered successfully',
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user' });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate required fields
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            // Find user
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '24h'
            });

            res.json({
                message: 'Logged in successfully',
                token
            });
        }  catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
}

module.exports = AuthController;
