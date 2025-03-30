const AuctionModel = require("../models/auctionModel");
const WatchlistModel = require("../models/watchListModel");
const xss = require('xss');

// Sanitize user input
const sanitizeUserInput = (input) => {
    if (typeof input !== 'string') return input;
    return xss(input, {
        whiteList: {}, // Don't allow any HTML tags
        stripIgnoreTag: true, // Strip HTML tags
        stripIgnoreTagBody: ['script'] // Strip script tags and their content
    });
};

const watchListController = {

    addToWatchlist: async (req, res) => {
        try {
            const { user_id, auction_id } = req.body;
            const sanitizedUserId = sanitizeUserInput(user_id);
            const sanitizedAuctionId = sanitizeUserInput(auction_id);
            
            const auction = await AuctionModel.getAuctionById(sanitizedAuctionId);
            if (!auction) {
                return res.status(404).json({ message: 'Auction not found' });
            }
            const watchItem = await WatchlistModel.getWatchItem(sanitizedUserId, sanitizedAuctionId);
               
            if(watchItem.length > 0) {
                return res.status(400).json({message: "Cannot watchlist the same item twice"})
            }

            const watchlistEntry = await WatchlistModel.addToWatchlist(sanitizedUserId, sanitizedAuctionId);
           return res.status(201).json(watchlistEntry);
        } catch (error) {
           return res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const { user_id, auction_id } = req.body;
            const sanitizedUserId = sanitizeUserInput(user_id);
            const sanitizedAuctionId = sanitizeUserInput(auction_id);
            
            const deleted = await WatchlistModel.removeFromWatchlist(sanitizedUserId, sanitizedAuctionId);
            if (!deleted) {
                return res.status(404).json({ message: 'Watchlist entry not found' });
            }
           return res.status(200).json({ message: 'Removed from watchlist' });
        } catch (error) {
           return res.status(500).json({ message: 'Error removing from watchlist', error: error.message });
        }
    },

    getUserWatchlist: async (req, res) => {
        try {
            const { userId } = req.params;
            const sanitizedUserId = sanitizeUserInput(userId);
            
            const watchlist = await WatchlistModel.getUserWatchlist(sanitizedUserId);
           return res.status(200).json(watchlist);
        } catch (error) {
           return res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
        }
    }
    
}

module.exports = watchListController;