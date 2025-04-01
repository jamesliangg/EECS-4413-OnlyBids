const SearchModel = require('../models/searchModel');
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

// Validates that a search keyword only contains alphanumeric, spaces, and special characters
const isValidSearchKeyword = (keyword) => {
    // Allow alphanumeric characters, spaces, and common special characters for search
    const validKeywordRegex = /^[A-Za-z0-9!@#$%^&*()\s]*$/;
    
    return validKeywordRegex.test(keyword);
};

const searchController = {
    // Autocomplete search
    autocomplete: async (req, res) => {
        try {
            const { keyword } = req.query;
            const sanitizedKeyword = sanitizeUserInput(keyword);

            if (!sanitizedKeyword) {
                return res.status(400).json({ error: 'Keyword is required' });
            }

            // Validate keyword format
            if (!isValidSearchKeyword(sanitizedKeyword)) {
                return res.status(400).json({ error: 'Search keyword contains invalid characters' });
            }

            const results = await SearchModel.findItemsAutocompletion(sanitizedKeyword);
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
            let sanitizedKeyword = keyword ? sanitizeUserInput(keyword) : "";

            // Validate keyword format
            if (sanitizedKeyword && !isValidSearchKeyword(sanitizedKeyword)) {
                return res.status(400).json({ error: "Search keyword contains invalid characters" });
            }

            // Fetch results
            const results = await SearchModel.findItemsFullSearch(sanitizedKeyword);

            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }
    },

    fullSearchByAuctionId: async(req, res) => {
        try {
            const { auctionId } = req.params;
            const sanitizedAuctionId = sanitizeUserInput(auctionId);

            if (!sanitizedAuctionId) {
                return res.status(400).json({ error: 'AuctionId is required' });
            }

            const results = await SearchModel.findItemByAuctionId(sanitizedAuctionId);
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = searchController;
