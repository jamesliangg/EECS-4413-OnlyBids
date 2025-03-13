const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Autocompletion (GET)
router.get('/autocompletion', searchController.autocomplete);

// Full search (GET)
router.get('/fullsearch', searchController.fullSearch);

// Item search (GET)
router.get('/item/:auctionId', searchController.fullSearchByAuctionId);

module.exports = router;