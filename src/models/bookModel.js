const db = require('../config/database');

class Book {
    static async create(book) {
        const [result] = await db.query(
            'INSERT INTO books (title, author, ISBN, quantity, shelf_location) VALUES (?, ?, ?, ?, ?)',
            [book.title, book.author, book.ISBN, book.quantity, book.shelf_location]
        );
        return result.insertId;
    }

    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    static async findAll() {
        const [rows] = await db.query('SELECT * FROM books');
        return rows;
    }

    static async update(id, book) {
        // Build dynamic update query based on provided fields
        const fields = [];
        const values = [];
        
        if (book.title !== undefined) {
            fields.push('title = ?');
            values.push(book.title);
        }
        if (book.author !== undefined) {
            fields.push('author = ?');
            values.push(book.author);
        }
        if (book.ISBN !== undefined) {
            fields.push('ISBN = ?');
            values.push(book.ISBN);
        }
        if (book.quantity !== undefined) {
            fields.push('quantity = ?');
            values.push(book.quantity);
        }
        if (book.shelf_location !== undefined) {
            fields.push('shelf_location = ?');
            values.push(book.shelf_location);
        }
        
        if (fields.length === 0) {
            return false; // No fields to update
        }
        
        values.push(id); // Add the ID for WHERE clause
        
        const [result] = await db.query(
            `UPDATE books SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async search(query) {
        const [rows] = await db.query(
            'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR ISBN LIKE ?',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
        return rows;
    }

    static async updateQuantity(id, change) {
        const [result] = await db.query(
            'UPDATE books SET quantity = quantity + ? WHERE id = ?',
            [change, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Book;
