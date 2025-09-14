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

            // Set HTTP-only cookie
            res.cookie('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/'
            });

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: userId,
                    email,
                    role
                }
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

            // Set HTTP-only cookie
            res.cookie('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/'
            });

            res.json({
                message: 'Logged in successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        }  catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error during login' });
        }
    }

    // Logout user
    static async logout(req, res) {
        try {
            // Clear the auth cookie
            res.clearCookie('auth-token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });

            res.json({
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Error during logout' });
        }
    }

    // Get current user information
    static async getCurrentUser(req, res) {
        try {
            // req.user comes from auth middleware after token verification
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({ message: 'Error fetching user information' });
        }
    }

    // Delete user
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Check if user exists
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const deleted = await User.deleteById(id);
            if (!deleted) {
                return res.status(500).json({ message: 'Failed to delete user' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }

    // Get all users (admin only)
    static async getAllUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    }
}

module.exports = AuthController;
