const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup route (POST)
router.post('/signup', userController.signup);

// Signin route (POST)
router.post('/signin', userController.signin);

module.exports = router;
