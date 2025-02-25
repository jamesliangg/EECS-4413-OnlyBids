const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userController = {
    signup: async (req, res) => {
        try {
            // Get the request body
            const { email, password, username } = req.body;

            // Validate input
            if (!email || !password || !username) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Validate email format
            // https://www.npmjs.com/package/validator
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' });
            }

            // Hash password
            // https://www.npmjs.com/package/bcryptjs
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await UserModel.create({
                email,
                password: hashedPassword,
                username
            });

            // Send a response with a 201 status code
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
            res.status(201).json({
                message: 'User created successfully',
                userId: user.insertId
            });

        } catch (error) {
            // Error handling
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = userController;
