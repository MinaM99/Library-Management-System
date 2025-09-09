const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/analytics/export/borrowings:
 *   get:
 *     summary: Export all borrowings for a specific period
 *     tags: [Analytics]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the period (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the period (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Borrowings report for the period
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsReport'
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 */
router.get('/export/borrowings', auth, AnalyticsController.exportBorrowings);

/**
 * @swagger
 * /api/analytics/export/overdue:
 *   get:
 *     summary: Export overdue borrowings for a specific period
 *     tags: [Analytics]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the period (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the period (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Overdue borrowings report for the period
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsReport'
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 */
router.get('/export/overdue', auth, AnalyticsController.exportOverdueBorrowings);

/**
 * @swagger
 * /api/analytics/export/last-month/borrowings:
 *   get:
 *     summary: Export all borrowings from last month
 *     tags: [Analytics]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last month's borrowings report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsReport'
 *       401:
 *         description: Unauthorized
 */
router.get('/export/last-month/borrowings', auth, AnalyticsController.exportLastMonthBorrowings);

/**
 * @swagger
 * /api/analytics/export/last-month/overdue:
 *   get:
 *     summary: Export overdue borrowings from last month
 *     tags: [Analytics]
 *     security:
 *       - basicAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last month's overdue borrowings report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsReport'
 *       401:
 *         description: Unauthorized
 */
router.get('/export/last-month/overdue', auth, AnalyticsController.exportLastMonthOverdueBorrowings);

module.exports = router;
