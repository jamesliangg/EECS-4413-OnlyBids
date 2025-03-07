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

// Update auction (PUT)
router.put('/update', auctionController.updateAuction);

// Update Dutch auction price (PUT)
router.put('/dutch/price', auctionController.updateDutchPrice);

module.exports = router;