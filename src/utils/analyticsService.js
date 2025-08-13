const { Parser } = require('json2csv');
const db = require('../config/database');

class AnalyticsService {
    static async getBorrowingsByPeriod(startDate, endDate) {
        const [rows] = await db.query(
            `SELECT 
                b.title as book_title,
                br.name as borrower_name,
                bo.borrow_date,
                bo.due_date,
                bo.return_date,
                bo.status
            FROM borrowings bo
            JOIN books b ON bo.book_id = b.id
            JOIN borrowers br ON bo.borrower_id = br.id
            WHERE bo.borrow_date BETWEEN ? AND ?`,
            [startDate, endDate]
        );
        return rows;
    }

    static async getOverdueBorrowingsByPeriod(startDate, endDate) {
        const [rows] = await db.query(
            `SELECT 
                b.title as book_title,
                br.name as borrower_name,
                br.email as borrower_email,
                bo.borrow_date,
                bo.due_date,
                DATEDIFF(CURRENT_TIMESTAMP, bo.due_date) as days_overdue
            FROM borrowings bo
            JOIN books b ON bo.book_id = b.id
            JOIN borrowers br ON bo.borrower_id = br.id
            WHERE bo.status = 'OVERDUE'
            AND bo.due_date BETWEEN ? AND ?`,
            [startDate, endDate]
        );
        return rows;
    }

    static async exportToCSV(data, fields) {
        try {
            const parser = new Parser({ fields });
            return parser.parse(data);
        } catch (error) {
            throw new Error('Error generating CSV');
        }
    }
}

module.exports = AnalyticsService;
