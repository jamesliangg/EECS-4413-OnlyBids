const db = require('../config/database');

const AuctionModel = {
  // Retrieve an auction by its ID.
  getAuctionById: async (auctionId) => {
    const [result] = await db.query(
      "SELECT * FROM Auction WHERE auction_id = ?",
      [auctionId]
    );
    return result[0];
  },

  //Update Auction for top bidder
  updateAuctionBid: async (auctionId, bidAmount, userId) => {
    const [result] = await db.query(
      "UPDATE Auction SET final_price = ?, winner_id = ? WHERE auction_id = ?",
      [bidAmount, userId, auctionId]
    );
    return result; 
  },

  // Create a new auction record.
  createAuction: async (auctionData) => {
    const { item_id, start_time, end_time, status, winner_id, final_price, type } = auctionData;
    const [result] = await db.query(
      "INSERT INTO Auction (item_id, start_time, end_time, status, winner_id, final_price, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [item_id, start_time, end_time, status || 'ongoing', winner_id || null, final_price || null, type]
    );
    return result.insertId; 
  },

  // Get all active (ongoing) auctions.
  getActiveAuctions: async () => {
    const [result] = await db.query(
      "SELECT * FROM Auction WHERE status = 'ongoing'"
    );
    return result; 
  }
};

module.exports = AuctionModel;
