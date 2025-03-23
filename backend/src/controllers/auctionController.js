const AuctionModel = require("../models/auctionModel");
const socketConfig = require("../config/socket");
const ItemModel = require("../models/itemModel");

const auctionController = {
  placeBid: async (req, res) => {
    const { auctionId, userId, bidAmount } = req.body;
    try {
      const auction = await AuctionModel.getAuctionById(auctionId);
      if (!auction) return res.status(404).json({ error: "Auction not found" });
      if (auction.status !== "ongoing")
        return res.status(400).json({ error: "Auction has ended" });

      // Ensure this is a forward auction
      if (auction.type !== "forward") {
        return res
          .status(400)
          .json({
            error:
              "This is not a forward auction. For Dutch auctions, use acceptDutchPrice endpoint.",
          });
      }

      const currentPrice = auction.final_price || 0;
      if (bidAmount <= currentPrice) {
        return res
          .status(400)
          .json({ error: "Bid must be higher than current price" });
      }

      // Update the auction bid.
      await AuctionModel.updateAuctionBid(
        auctionId,
        bidAmount,
        userId,
        "ongoing"
      );

      const io = socketConfig.getIO();

      // Enter auction room
      // https://socket.io/docs/v3/rooms/
      io.to(`auction_${auctionId}`).emit("newBid", {
        auctionId,
        userId,
        bidAmount,
      });
      res.status(200).json({ message: "Bid placed successfully!" });
    } catch (error) {
      console.error("Error placing bid:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createAuction: async (req, res) => {
    const {
      seller_id,
      name,
      description,
      starting_price,
      image_url,
      start_time,
      end_time,
      type,
    } = req.body;

    // Validate that all required parameters are present
    const requiredParams = [
      "seller_id",
      "name",
      "description",
      "starting_price",
      "image_url",
      "start_time",
      "end_time",
      "type",
    ];
    const missingParams = requiredParams.filter(
      (param) => req.body[param] === undefined
    );

    if (missingParams.length > 0) {
      return res.status(400).json({
        error: "Missing required parameters",
        missingParams,
      });
    }

    // Validate that starting price is greater than zero
    if (parseFloat(starting_price) <= 0) {
      return res.status(400).json({
        error: "Starting price must be greater than zero",
      });
    }

    // Validate that end time is not before start time
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    const currentDate = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Expected format: YYYY-MM-DD HH:MM:SS",
      });
    }

    // Validate that start time is not in the past
    //if (startDate < currentDate) {
      //return res.status(400).json({
        //error: "Start time cannot be in the past",
      //});
    //}

    if (endDate <= startDate) {
      return res.status(400).json({
        error: "End time must be after start time",
      });
    }

    try {
      //Create the item
      const item_id = await ItemModel.createItem({
        seller_id,
        name,
        description,
        starting_price,
        image_url,
      });
      if (!item_id)
        return res.status(500).json({ error: "Item creation failed" });
      // Create the auction
      const auctionId = await AuctionModel.createAuction({
        item_id,
        start_time,
        end_time,
        status: "ongoing",
        winner_id: null,
        final_price: null,
        type,
      });

      if (!auctionId)
        return res.status(500).json({ error: "Auction creation failed" });

      res
        .status(201)
        .json({ message: "Auction created successfully!", auctionId, item_id });
    } catch (error) {
      console.error("Error creating auction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAuction: async (req, res) => {
    const { auctionId } = req.params;
    try {
      const result = await AuctionModel.getAuctionById(auctionId);
      if (!result) return res.status(404).json({ error: "Auction not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAuctions: async (req, res) => {
    try {
      const result = await AuctionModel.getActiveAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAllAuctions: async (req, res) => {
    try {
      const result = await AuctionModel.getAllAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateAuction: async (req, res) => {
    const { auctionId, bidAmount, userId, status } = req.body;

    try {
      await AuctionModel.updateAuctionBid(auctionId, bidAmount, userId, status);
      res.status(200).json({ message: "Auction updated successfully!" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  updateDutchPrice: async (req, res) => {
    const { auctionId, newPrice } = req.body;

    try {
      // Validate that newPrice is greater than 0
      if (newPrice <= 0) {
        return res.status(400).json({ error: "Price must be greater than 0" });
      }

      // Get auction to verify it's a Dutch auction
      const auction = await AuctionModel.getAuctionById(auctionId);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }
      if (auction.type !== "dutch") {
        return res.status(400).json({ error: "This is not a Dutch auction" });
      }
      if (auction.status !== "ongoing") {
        return res.status(400).json({ error: "Auction is not ongoing" });
      }

      // Update the price
      const updated = await AuctionModel.updateDutchAuctionPrice(
        auctionId,
        newPrice
      );
      if (!updated) {
        return res.status(400).json({ error: "Failed to update price" });
      }

      // Emit WebSocket event to all clients in the auction room
      const io = socketConfig.getIO();
      const roomName = `auction_${auctionId}`;
      console.log(`Attempting to emit dutchPriceUpdate to room: ${roomName}`);
      console.log("Event data:", {
        auctionId,
        newPrice,
        timestamp: new Date().toISOString(),
      });

      // Get room info for debugging
      const room = io.sockets.adapter.rooms.get(roomName);
      const numClients = room ? room.size : 0;
      console.log(`Number of clients in room ${roomName}: ${numClients}`);

      io.to(roomName).emit("dutchPriceUpdate", {
        auctionId,
        newPrice,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        message: "Dutch auction price updated successfully",
        auctionId,
        newPrice,
      });
    } catch (error) {
      console.error("Error updating Dutch auction price:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  acceptDutchPrice: async (req, res) => {
    const { auctionId, userId } = req.body;
    try {
      // Get auction to verify it's a Dutch auction
      const auction = await AuctionModel.getAuctionById(auctionId);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }
      if (auction.type !== "dutch") {
        return res.status(400).json({ error: "This is not a Dutch auction" });
      }
      if (auction.status !== "ongoing") {
        return res.status(400).json({ error: "Auction is not ongoing" });
      }

      // Accept the current price
      const success = await AuctionModel.acceptDutchAuctionPrice(
        auctionId,
        userId
      );
      if (!success) {
        return res
          .status(400)
          .json({ error: "Failed to accept Dutch auction price" });
      }

      // Get the updated auction to get the final price
      const updatedAuction = await AuctionModel.getAuctionById(auctionId);

      // Notify all clients in the auction room
      const io = socketConfig.getIO();
      io.to(`auction_${auctionId}`).emit("auctionEnded", {
        auctionId,
        winner: userId,
        finalPrice: updatedAuction.final_price,
        message: "Dutch auction ended - Current price accepted",
      });

      res.status(200).json({
        message: "Dutch auction price accepted successfully",
        auctionId,
        finalPrice: updatedAuction.final_price,
      });
    } catch (error) {
      console.error("Error accepting Dutch auction price:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = auctionController;
