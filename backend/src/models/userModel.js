const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(user) {
        const hashedPassword = await bcrypt.hash(user.password, 8);
        const [result] = await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [user.email, hashedPassword, user.role || 'user']
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;
