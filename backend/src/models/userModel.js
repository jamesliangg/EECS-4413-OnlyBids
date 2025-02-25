const db = require('../config/database');

const UserModel = {
    // Create a new user
    create: async (userData) => {
        // Insert a new user into the database
        // https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp
        const [result] = await db.query(
            'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
            [userData.email, userData.password, userData.username]
        );
        return result;
    },

    // Find a user by email
    findByEmail: async (email) => {
        // Select a user from the database
        // https://www.w3schools.com/nodejs/nodejs_mysql_select.asp
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }
};

module.exports = UserModel;
