const db = require('../config/database');

class Borrowing {
    static async getAll() {
        const [rows] = await db.query(
            `SELECT 
                br.id,
                br.book_id,
                br.borrower_id,
                br.borrow_date,
                br.due_date,
                br.return_date,
                br.status,
                b.title as book_title,
                b.author as book_author,
                bo.name as borrower_name,
                bo.email as borrower_email
             FROM borrowings br 
             JOIN books b ON br.book_id = b.id 
             JOIN borrowers bo ON br.borrower_id = bo.id 
             ORDER BY br.borrow_date DESC`
        );
        return rows;
    }

    static async create(borrowing) {
        const [result] = await db.query(
            'INSERT INTO borrowings (book_id, borrower_id, due_date) VALUES (?, ?, ?)',
            [borrowing.book_id, borrowing.borrower_id, borrowing.due_date]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT br.*, b.title as book_title, bo.name as borrower_name 
             FROM borrowings br 
             JOIN books b ON br.book_id = b.id 
             JOIN borrowers bo ON br.borrower_id = bo.id 
             WHERE br.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async returnBook(id) {
        const [result] = await db.query(
            `UPDATE borrowings 
             SET return_date = CURRENT_TIMESTAMP, 
                 status = 'RETURNED' 
             WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    static async getOverdueBooks() {
        const [rows] = await db.query(
            `SELECT 
                b.id as book_id,
                b.title as book_title,
                b.author,
                br.id as borrower_id,
                br.name as borrower_name,
                br.email as borrower_email,
                bw.id as borrowing_id,
                bw.borrow_date,
                bw.due_date,
                DATEDIFF(CURRENT_TIMESTAMP, bw.due_date) as days_overdue
            FROM borrowings bw
            JOIN books b ON bw.book_id = b.id
            JOIN borrowers br ON bw.borrower_id = br.id
            WHERE bw.status = 'OVERDUE'
            AND bw.due_date < CURRENT_TIMESTAMP
            ORDER BY days_overdue DESC`
        );
        return rows;
    }

    static async getBorrowerOverdueBooks(borrowerId) {
        const [rows] = await db.query(
            `SELECT 
                b.id as book_id,
                b.title as book_title,
                b.author,
                bw.id as borrowing_id,
                bw.borrow_date,
                bw.due_date,
                DATEDIFF(CURRENT_TIMESTAMP, bw.due_date) as days_overdue
            FROM borrowings bw
            JOIN books b ON bw.book_id = b.id
            WHERE bw.borrower_id = ?
            AND bw.status = 'OVERDUE'
            AND bw.due_date < CURRENT_TIMESTAMP
            ORDER BY days_overdue DESC`,
            [borrowerId]
        );
        return rows;
    }

    static async updateOverdueStatus() {
        await db.query(
            `UPDATE borrowings 
             SET status = 'OVERDUE' 
             WHERE status = 'BORROWED' 
             AND due_date < CURRENT_TIMESTAMP`
        );
    }

    static async findByBorrowerId(borrowerId) {
        const [rows] = await db.query(
            `SELECT br.*, b.title as book_title, b.author as book_author, b.ISBN as book_isbn
             FROM borrowings br 
             JOIN books b ON br.book_id = b.id 
             WHERE br.borrower_id = ?
             ORDER BY br.borrow_date DESC`,
            [borrowerId]
        );
        return rows;
    }
}

module.exports = Borrowing;
