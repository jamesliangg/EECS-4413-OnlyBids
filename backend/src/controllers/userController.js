const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Validates that a password only contains alphanumeric and specific special characters
const isValidPassword = (password) => {
    // Check if password contains only alphanumeric and allowed special characters
    // Regex that allows only ASCII alphanumeric and these specific special characters: !@#$%^&*()
    const validPasswordRegex = /^[A-Za-z0-9!@#$%^&*()]+$/;
    
    // Check for spaces
    if (password.includes(' ')) {
        return { valid: false, reason: 'Password cannot contain spaces' };
    }
    
    // Check if password matches the valid pattern
    if (!validPasswordRegex.test(password)) {
        return { valid: false, reason: 'Password can only contain alphanumeric characters and these special characters: !@#$%^&*()' };
    }
    
    return { valid: true };
};

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

            // Validate username is alphanumeric
            if (!validator.isAlphanumeric(username)) {
                return res.status(400).json({ error: 'Username must contain only letters and numbers' });
            }

            // Validate username length
            if (username.length > 50) {
                return res.status(400).json({ error: 'Username must be less than 50 characters' });
            }

            // Validate password format
            const passwordCheck = isValidPassword(password);
            if (!passwordCheck.valid) {
                return res.status(400).json({ error: passwordCheck.reason });
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
    },

    signin: async (req, res) => {
        try {
            // Get the request body
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Validate email format
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Validate password format
            const passwordCheck = isValidPassword(password);
            if (!passwordCheck.valid) {
                return res.status(400).json({ error: passwordCheck.reason });
            }

            // Find user by email
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Compare password with hashed password in database
            const isValidPasswordMatch = await bcrypt.compare(password, user.password_hash);
            if (!isValidPasswordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Send success response with user data (excluding password)
            const { password_hash, ...userData } = user;
            res.status(200).json({
                message: 'Sign in successful',
                user: userData
            });

        } catch (error) {
            // Error handling
            console.error('Signin error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = userController;
