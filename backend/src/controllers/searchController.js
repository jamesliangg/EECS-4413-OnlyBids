const SearchModel = require('../models/searchModel');

// Validates that a search keyword only contains alphanumeric, spaces, and special characters
const isValidSearchKeyword = (keyword) => {
    // Allow alphanumeric characters, spaces, and common special characters for search
    const validKeywordRegex = /^[A-Za-z0-9!@#$%^&*()\s]+$/;
    
    return validKeywordRegex.test(keyword);
};

const searchController = {
    // Autocomplete search
    autocomplete: async (req, res) => {
        try {
            const { keyword } = req.query;

            if (!keyword) {
                return res.status(400).json({ error: 'Keyword is required' });
            }

            // Validate keyword format
            if (!isValidSearchKeyword(keyword)) {
                return res.status(400).json({ error: 'Search keyword contains invalid characters' });
            }

            const results = await SearchModel.findItemsAutocompletion(keyword);
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    // Full search
    fullSearch: async (req, res) => {
        try {
            const { keyword } = req.query;

            if (!keyword) {
                return res.status(400).json({ error: 'Keyword is required' });
            }

            // Validate keyword format
            if (!isValidSearchKeyword(keyword)) {
                return res.status(400).json({ error: 'Search keyword contains invalid characters' });
            }

            const results = await SearchModel.findItemsFullSearch(keyword);
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    fullSearchByAuctionId: async(req, res) => {
        try {
            const { auctionId } = req.params;

            if (!auctionId) {
                return res.status(400).json({ error: 'AuctionId is required' });
            }

            const results = await SearchModel.findItemByAuctionId(auctionId);
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = searchController;
