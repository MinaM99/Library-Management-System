const db = require('../config/database');

class Borrower {
    static async create(borrower) {
        const [result] = await db.query(
            'INSERT INTO borrowers (name, email) VALUES (?, ?)',
            [borrower.name, borrower.email]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM borrowers WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM borrowers WHERE email = ?', [email]);
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM borrowers');
        return rows;
    }

    static async update(id, borrower) {
        // Build dynamic query based on provided fields
        const fields = [];
        const values = [];
        
        if (borrower.name !== undefined) {
            fields.push('name = ?');
            values.push(borrower.name);
        }
        
        if (borrower.email !== undefined) {
            fields.push('email = ?');
            values.push(borrower.email);
        }
        
        if (fields.length === 0) {
            return false;
        }
        
        values.push(id);
        
        const [result] = await db.query(
            `UPDATE borrowers SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM borrowers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async getCurrentBorrowings(id) {
        const [rows] = await db.query(
            `SELECT b.*, br.borrow_date, br.due_date, br.status 
             FROM books b 
             JOIN borrowings br ON b.id = br.book_id 
             WHERE br.borrower_id = ? AND br.status = 'BORROWED'`,
            [id]
        );
        return rows;
    }
}

module.exports = Borrower;
