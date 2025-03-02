const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Creating bid (POST)
router.post('/bid', auctionController.placeBid);

// Creating auction (POST)
router.post('/create', auctionController.createAuction);

// Getting auction from auctionId (GET)
router.get('/:auctionId', auctionController.getAuction);

// Getting auctions from auctionId (GET)
router.get('/auctions', auctionController.getAuctions);

module.exports = router;