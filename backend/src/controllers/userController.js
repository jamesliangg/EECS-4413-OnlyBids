const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userController = {
    signup: async (req, res) => {
        try {
            // Get the request body
            const { email, password, username, street, city, state, postal_code, country } = req.body;

            // Validate required fields
            if (!email || !password || !username) {
                return res.status(400).json({ error: 'Email, password, and username are required' });
            }

            // Validate email format
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Validate username length
            if (username.length > 50) {
                return res.status(400).json({ error: 'Username must be less than 50 characters' });
            }

            // Validate postal code if provided
            if (postal_code && postal_code.length > 20) {
                return res.status(400).json({ error: 'Postal code must be less than 20 characters' });
            }

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user with all fields
            const user = await UserModel.create({
                email,
                password: hashedPassword,
                username,
                street,
                city,
                state,
                postal_code,
                country
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
