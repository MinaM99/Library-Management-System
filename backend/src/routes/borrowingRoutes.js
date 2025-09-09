const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/borrowingController');

/**
 * @swagger
 * /api/borrowings:
 *   get:
 *     summary: Get all borrowings
 *     tags: [Borrowings]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all borrowings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   borrower_id:
 *                     type: integer
 *                   borrow_date:
 *                     type: string
 *                     format: date-time
 *                   due_date:
 *                     type: string
 *                     format: date-time
 *                   return_date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   book_title:
 *                     type: string
 *                   book_author:
 *                     type: string
 *                   borrower_name:
 *                     type: string
 *                   borrower_email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', BorrowingController.getAllBorrowings);

/**
 * @swagger
 * /api/borrowings/checkout:
 *   post:
 *     summary: Checkout a book to a borrower
 *     tags: [Borrowings]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *               - borrower_id
 *               - due_date
 *             properties:
 *               book_id:
 *                 type: integer
 *                 description: ID of the book to borrow
 *               borrower_id:
 *                 type: integer
 *                 description: ID of the borrower
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: When the book should be returned (YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Book checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book checked out successfully
 *                 borrowingId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid input or book not available
 *       404:
 *         description: Book or borrower not found
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', BorrowingController.checkoutBook);

/**
 * @swagger
 * /api/borrowings/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     tags: [Borrowings]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrowing record ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book returned successfully
 *       404:
 *         description: Borrowing record not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id/return', BorrowingController.returnBook);

/**
 * @swagger
 * /api/borrowings/overdue:
 *   get:
 *     summary: Get all overdue books
 *     tags: [Borrowings]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all overdue books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowingDetails'
 *       401:
 *         description: Unauthorized
 */
router.get('/overdue', BorrowingController.getOverdueBooks);

/**
 * @swagger
 * /api/borrowings/overdue/borrower/{borrowerId}:
 *   get:
 *     summary: Get overdue books for a specific borrower
 *     tags: [Borrowings]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: borrowerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the borrower
 *     responses:
 *       200:
 *         description: List of overdue books for the borrower
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
router.get('/overdue/borrower/:borrowerId', BorrowingController.getBorrowerOverdueBooks);

/**
 * @swagger
 * /api/borrows/borrower/{id}:
 *   get:
 *     summary: Get all borrowed books for a borrower
 *     tags: [Borrowings]
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
 *         description: List of borrowed books for the borrower
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
router.get('/borrower/:id', BorrowingController.getBorrowedBooksByBorrower);

module.exports = router;
