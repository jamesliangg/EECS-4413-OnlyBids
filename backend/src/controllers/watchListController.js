const AuctionModel = require("../models/auctionModel");
const WatchlistModel = require("../models/watchListModel");

const watchListController = {

    addToWatchlist: async (req, res) => {
        try {
            const { user_id, auction_id } = req.body;
            
            const auction = await AuctionModel.getAuctionById(auction_id);
            if (!auction) {
                return res.status(404).json({ message: 'Auction not found' });
            }
            const watchItem = await WatchlistModel.getWatchItem(user_id, auction_id);
               
            if(watchItem.length > 0) {
                return res.status(400).json({message: "Cannot watchlist the same item twice"})
            }

            const watchlistEntry = await WatchlistModel.addToWatchlist(user_id, auction_id);
           return res.status(201).json(watchlistEntry);
        } catch (error) {
           return res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const { user_id, auction_id } = req.body;
            
            const deleted = await WatchlistModel.removeFromWatchlist(user_id, auction_id);
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
            
            const watchlist = await WatchlistModel.getUserWatchlist(userId);
           return res.status(200).json(watchlist);
        } catch (error) {
           return res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
        }
    }
    
}

module.exports = watchListController;