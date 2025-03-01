const SearchModel = require('../models/searchModel');

const searchController = {
    // Autocomplete search
    autocomplete: async (req, res) => {
        try {
            const { keyword } = req.query;

            if (!keyword) {
                return res.status(400).json({ error: 'Keyword is required' });
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

            const results = await SearchModel.findItemsFullSearch(keyword);
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = searchController;
