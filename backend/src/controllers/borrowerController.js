const Borrower = require('../models/borrowerModel');
const { validateEmail } = require("../utils/validation");

// Helper function for consistent error logging
const logError = (operation, error, context = {}) => {
    console.error(`[BorrowerController.${operation}] Error:`, {
        message: error.message,
        stack: error.stack,
        ...context
    });
};

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
            console.log(`[BorrowerController.registerBorrower] Success: Created borrower ID ${borrowerId} for email ${email}`);
            
            res.status(201).json({ 
                message: 'Borrower registered successfully',
                borrowerId 
            });
        } catch (error) {
            logError('registerBorrower', error, { requestBody: req.body });
            res.status(500).json({ message: 'Error registering borrower' });
        }
    }

    // Get all borrowers
    static async getAllBorrowers(req, res) {
        try {
            const borrowers = await Borrower.findAll();
            res.json(borrowers);
        } catch (error) {
            logError('getAllBorrowers', error);
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
            logError('getBorrower', error, { borrowerId: req.params.id });
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

            console.log(`[BorrowerController.updateBorrower] Success: Updated borrower ID ${req.params.id}`);
            res.json({ message: 'Borrower updated successfully' });
        } catch (error) {
            logError('updateBorrower', error, { 
                borrowerId: req.params.id, 
                requestBody: req.body 
            });
            res.status(500).json({ message: 'Error updating borrower' });
        }
    }

    // Delete a borrower
    static async deleteBorrower(req, res) {
        try {
            const borrowerId = req.params.id;
            
            // Validate borrower ID
            if (!borrowerId || isNaN(parseInt(borrowerId))) {
                return res.status(400).json({ message: 'Invalid borrower ID' });
            }

            // Check if borrower has any active borrowings before deletion
            const activeBorrowings = await Borrower.getCurrentBorrowings(borrowerId);
            if (activeBorrowings && activeBorrowings.length > 0) {
                return res.status(400).json({ 
                    message: 'Cannot delete borrower with active borrowings',
                    activeBorrowings: activeBorrowings.length
                });
            }

            const deleted = await Borrower.delete(borrowerId);
            if (!deleted) {
                return res.status(404).json({ message: 'Borrower not found' });
            }
            
            console.log(`[BorrowerController.deleteBorrower] Success: Deleted borrower ID ${borrowerId}`);
            res.json({ message: 'Borrower deleted successfully' });
        } catch (error) {
            logError('deleteBorrower', error, { borrowerId: req.params.id });
            res.status(500).json({ message: 'Error deleting borrower' });
        }
    }

    // Get borrower's current borrowings
    static async getCurrentBorrowings(req, res) {
        try {
            const borrowings = await Borrower.getCurrentBorrowings(req.params.id);
            res.json(borrowings);
        } catch (error) {
            logError('getCurrentBorrowings', error, { borrowerId: req.params.id });
            res.status(500).json({ message: 'Error retrieving borrowings' });
        }
    }
}

module.exports = BorrowerController;
