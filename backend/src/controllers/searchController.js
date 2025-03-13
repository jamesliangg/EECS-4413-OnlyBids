const SearchModel = require('../models/searchModel');

// Validates that a search keyword only contains alphanumeric and special characters
const isValidSearchKeyword = (keyword) => {
    // Allow alphanumeric characters and common special characters for search
    const validKeywordRegex = /^[A-Za-z0-9!@#$%^&*()]+$/;
    
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
    }
};

module.exports = searchController;
