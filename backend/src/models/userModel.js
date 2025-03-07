const db = require('../config/database');

const UserModel = {
    // Create a new user
    create: async (userData) => {
        // Insert a new user into the database
        // https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp
        const [result] = await db.query(
            'INSERT INTO User (username, email, password_hash, street, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                userData.username,
                userData.email,
                userData.password,
                userData.street || null,
                userData.city || null,
                userData.state || null,
                userData.postal_code || null,
                userData.country || null
            ]
        );
        return result;
    },

    // Find a user by email
    findByEmail: async (email) => {
        // Select a user from the database
        // https://www.w3schools.com/nodejs/nodejs_mysql_select.asp
        const [rows] = await db.query(
            'SELECT * FROM User WHERE email = ?',
            [email]
        );
        return rows[0];
    }
};

module.exports = UserModel;
