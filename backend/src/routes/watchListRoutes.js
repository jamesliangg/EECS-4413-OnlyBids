const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchListController');

router.post('/add', watchlistController.addToWatchlist);
router.post('/remove', watchlistController.removeFromWatchlist);
router.get('/user/:userId', watchlistController.getUserWatchlist);


module.exports = router;
