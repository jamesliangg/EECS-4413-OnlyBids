const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route (POST)
router.post('/signup', userController.signup);

// Signin route (POST)
router.post('/signin', userController.signin);

// Request password reset route (POST)
router.post('/request-reset', userController.requestReset);

// Reset password route (POST)
router.post('/reset-password', userController.resetPassword);

module.exports = router;
