const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Autocompletion (GET)
router.get('/autocompetion/:keyword', searchController.autocomplete);

// Full search (GET)
router.get('/fullsearch/:keyword', searchController.fullSearch);

module.exports = router;