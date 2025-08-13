const Borrower = require('../models/borrowerModel');
const { validateEmail } = require("../utils/validation");

class BorrowerController {
    // Register a new borrower
    static async registerBorrower(req, res) {
        try {
            const { name, email } = req.body;
            
            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({ message: 'Name and email are required' });
            }

            // Validate email format
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Check if email already exists
            const existingBorrower = await Borrower.findByEmail(email);
            if (existingBorrower) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const borrowerId = await Borrower.create({ name, email });
            res.status(201).json({ 
                message: 'Borrower registered successfully',
                borrowerId 
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering borrower' });
        }
    }

    // Get all borrowers
    static async getAllBorrowers(req, res) {
        try {
            const borrowers = await Borrower.findAll();
            res.json(borrowers);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving borrowers' });
        }
    }

    // Get a specific borrower
    static async getBorrower(req, res) {
        try {
            const borrower = await Borrower.findById(req.params.id);
            if (!borrower) {
                return res.status(404).json({ message: 'Borrower not found' });
            }
            res.json(borrower);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving borrower' });
        }
    }

    // Update borrower details - allows partial updates
    static async updateBorrower(req, res) {
        try {
            const { name, email } = req.body;
            
            // Check if at least one field is provided
            if (!name && !email) {
                return res.status(400).json({ message: 'At least one field (name or email) is required for update' });
            }

            // Validate email format if provided
            if (email && !validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            // Check if email already exists for another borrower
            if (email) {
                const existingBorrower = await Borrower.findByEmail(email);
                if (existingBorrower && existingBorrower.id !== parseInt(req.params.id)) {
                    return res.status(400).json({ message: 'Email already registered' });
                }
            }

            // Build update object with only provided fields
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;

            const updated = await Borrower.update(req.params.id, updateData);
            if (!updated) {
                return res.status(404).json({ message: 'Borrower not found' });
            }

            res.json({ message: 'Borrower updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating borrower' });
        }
    }

    // Delete a borrower
    static async deleteBorrower(req, res) {
        try {
            const deleted = await Borrower.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: 'Borrower not found' });
            }
            res.json({ message: 'Borrower deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting borrower' });
        }
    }

    // Get borrower's current borrowings
    static async getCurrentBorrowings(req, res) {
        try {
            const borrowings = await Borrower.getCurrentBorrowings(req.params.id);
            res.json(borrowings);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving borrowings' });
        }
    }
}

module.exports = BorrowerController;
