const db = require("../config/database");
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
  updateAuctionBid: async (auctionId, bidAmount, userId, status) => {
    const [result] = await db.query(
      "UPDATE Auction SET final_price = ?, winner_id = ? WHERE auction_id = ? AND status = ?",
      [bidAmount, userId, auctionId, status]
    );
    return result;
  },

  //Update Auction status for buyer
  updateAuctionStatus: async (auctionId, status) => {
    const [result] = await db.query(
      "UPDATE Auction SET status = ? WHERE auction_id = ?",
      [status, auctionId]
    );
    return result;
  },

  // Create a new auction record.
  createAuction: async (auctionData) => {
    const {
      item_id,
      start_time,
      end_time,
      status,
      winner_id,
      final_price,
      type,
    } = auctionData;
    const [result] = await db.query(
      "INSERT INTO Auction (item_id, start_time, end_time, status, winner_id, final_price, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        item_id,
        start_time,
        end_time,
        status || "ongoing",
        winner_id || null,
        final_price || null,
        type,
      ]
    );
    return result.insertId;
  },

  // Get all active (ongoing) auctions.
  getActiveAuctions: async () => {
    const [result] = await db.query(
      "SELECT * FROM Auction WHERE status = 'ongoing'"
    );
    return result;
  },

  // Get all active (ongoing) auctions.
  getAllAuctions: async () => {
    const [result] = await db.query("SELECT * FROM Auction");
    return result;
  },

  getAuctionWinner: async (auctionId) => {
    const [result] = await db.query(
      "SELECT winner_id FROM Auction WHERE auction_id = ?",
      [auctionId]
    );
    return result;
  },

  // Update Dutch auction price
  updateDutchAuctionPrice: async (auctionId, newPrice) => {
    const [result] = await db.query(
      "UPDATE Auction SET final_price = ? WHERE auction_id = ? AND type = 'dutch' AND status = 'ongoing'",
      [newPrice, auctionId]
    );
    return result.affectedRows > 0;
  },

  // Accept current Dutch auction price
  acceptDutchAuctionPrice: async (auctionId, userId) => {
    // First get the auction to check prices
    const [auction] = await db.query(
      "SELECT i.starting_price, a.final_price FROM Auction a JOIN Item i ON a.item_id = i.item_id WHERE a.auction_id = ?",
      [auctionId]
    );

    const priceToUse = auction[0].final_price || auction[0].starting_price;

    const [result] = await db.query(
      "UPDATE Auction SET status = 'completed', winner_id = ?, final_price = ? WHERE auction_id = ? AND type = 'dutch' AND status = 'ongoing'",
      [userId, priceToUse, auctionId]
    );
    return result.affectedRows > 0;
  },
};

module.exports = AuctionModel;
