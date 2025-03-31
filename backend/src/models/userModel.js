const db = require("../config/database");
const bcrypt = require("bcryptjs");

const UserModel = {
  // Create a new user
  create: async (userData) => {
    // Insert a new user into the database
    // https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp
    const [result] = await db.query(
      "INSERT INTO User (username, email, password_hash, security_question, security_answer, street, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userData.username,
        userData.email,
        userData.password,
        userData.security_question,
        userData.security_answer,
        userData.street || null,
        userData.city || null,
        userData.state || null,
        userData.postal_code || null,
        userData.country || null,
      ]
    );
    return result;
  },

  // Find a user by email
  findByEmail: async (email) => {
    // Select a user from the database
    // https://www.w3schools.com/nodejs/nodejs_mysql_select.asp
    const [rows] = await db.query("SELECT * FROM User WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  // Update user password
  updatePassword: async (userId, newPasswordHash) => {
    const [result] = await db.query(
      "UPDATE User SET password_hash = ? WHERE user_id = ?",
      [newPasswordHash, userId]
    );
    return result;
  },

  // Verify security answer
  verifySecurityAnswer: async (email, securityAnswer) => {
    const [rows] = await db.query(
      "SELECT user_id, security_answer FROM User WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return { verified: false };
    }

    // Compare the provided answer with the stored answer using bcrypt
    // https://www.npmjs.com/package/bcrypt
    const isMatch = await bcrypt.compare(
      securityAnswer,
      rows[0].security_answer
    );

    if (isMatch) {
      return { verified: true, userId: rows[0].user_id };
    }

    return { verified: false };
  },

  findUserAddressById: async (userId) => {
    const [result] = await db.query(
      "SELECT street, city, state, postal_code, country FROM User WHERE user_id = ?",
      [userId]
    );
    return result;
  },
};

module.exports = UserModel;
