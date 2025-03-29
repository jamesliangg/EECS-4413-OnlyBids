const db = require('../config/database');

const WatchlistModel = {
    addToWatchlist: async (user_id, auction_id) => {
        const query = `INSERT INTO Watchlist (user_id, auction_id) VALUES (?, ?)`;
        const [result] = await db.execute(query, [user_id, auction_id]);
        return result;
    },
    removeFromWatchlist: async (user_id, auction_id) => {
        const query = `DELETE FROM Watchlist WHERE user_id = ? AND auction_id = ?`;
        const [result] = await db.execute(query, [user_id, auction_id]);
        return result;
    },

    getUserWatchlist: async (user_id) => {
        const query = `
            SELECT a.*, i.name, i.description, i.starting_price, i.image_url
            FROM Watchlist w
            JOIN Auction a ON w.auction_id = a.auction_id
            JOIN Item i ON a.item_id = i.item_id
            WHERE w.user_id = ?`;
        
        const [rows] = await db.execute(query, [user_id]);
        return rows;
    },

    getWatchItem: async (user_id ,auction_id) => {
        const query = `
        SELECT *
        FROM Watchlist w
        WHERE w.user_id = ? AND w.auction_id = ?`

        const[rows] = await db.execute(query, [user_id, auction_id])

        return rows;
        
    }
    
}

module.exports = WatchlistModel;