const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const { email, password, role } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            // Validate email format
            const { validateEmail } = require('../utils/validation');
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Check if email already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Create user
            const userId = await User.create({
                email,
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
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            // Validate email format
            const { validateEmail } = require('../utils/validation');
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Find user
            const user = await User.findByEmail(email);
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
