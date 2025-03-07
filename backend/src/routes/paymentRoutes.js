const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Attempting Payment (POST)
router.post('/pay', paymentController.attemptPayment);

module.exports = router;
