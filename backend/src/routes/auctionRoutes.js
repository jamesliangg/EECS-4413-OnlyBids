const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");

// Creating bid (POST)
router.post("/bid", auctionController.placeBid);

// Creating auction (POST)
router.post("/create", auctionController.createAuction);

// Getting active auctions (GET)
router.get("/auctions", auctionController.getAuctions);

// Getting all auctions (GET)
router.get("/auctions/history", auctionController.getAllAuctions);

// Update auction (PUT)
router.put("/update", auctionController.updateAuction);

// Update Dutch auction price (PUT)
router.put("/dutch/price", auctionController.updateDutchPrice);

// Accept current Dutch auction price (POST)
router.post("/dutch/accept", auctionController.acceptDutchPrice);

// Getting specific auction by ID (GET) - Move this to the end
router.get("/:auctionId", auctionController.getAuction);

module.exports = router;
