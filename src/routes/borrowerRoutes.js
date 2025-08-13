const express = require('express');
const router = express.Router();
const BorrowerController = require('../controllers/borrowerController');

/**
 * @swagger
 * /api/borrowers:
 *   get:
 *     summary: Get all borrowers
 *     tags: [Borrowers]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all borrowers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Borrower'
 *       401:
 *         description: Unauthorized
 * 
 *   post:
 *     summary: Register a new borrower
 *     tags: [Borrowers]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Borrower'
 *     responses:
 *       201:
 *         description: Borrower registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Borrower registered successfully
 *                 borrowerId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.get('/', BorrowerController.getAllBorrowers);
router.post('/', BorrowerController.registerBorrower);

/**
 * @swagger
 * /api/borrowers/{id}:
 *   get:
 *     summary: Get a borrower by ID
 *     tags: [Borrowers]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrower ID
 *     responses:
 *       200:
 *         description: Borrower details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrower'
 *       404:
 *         description: Borrower not found
 *       401:
 *         description: Unauthorized
 * 
 *   put:
 *     summary: Update a borrower
 *     tags: [Borrowers]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrower ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowerUpdate'
 *     responses:
 *       200:
 *         description: Borrower updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Borrower updated successfully
 *       404:
 *         description: Borrower not found
 *       401:
 *         description: Unauthorized
 * 
 *   delete:
 *     summary: Delete a borrower
 *     tags: [Borrowers]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrower ID
 *     responses:
 *       200:
 *         description: Borrower deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Borrower deleted successfully
 *       404:
 *         description: Borrower not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', BorrowerController.getBorrower);
router.put('/:id', BorrowerController.updateBorrower);

/**
 * @swagger
 * /api/borrowers/{id}/borrowings:
 *   get:
 *     summary: Get borrower's current borrowings
 *     tags: [Borrowers]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrower ID
 *     responses:
 *       200:
 *         description: List of borrower's current borrowings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowingDetails'
 *       404:
 *         description: Borrower not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/borrowings', BorrowerController.getCurrentBorrowings);
router.delete('/:id', BorrowerController.deleteBorrower);

module.exports = router;
