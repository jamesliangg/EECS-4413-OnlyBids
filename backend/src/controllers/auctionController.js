const AuctionModel = require("../models/auctionModel");
const socketConfig = require("../config/socket");
const ItemModel = require("../models/itemModel");
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

const auctionController = {
  placeBid: async (req, res) => {
    const { auctionId, userId, bidAmount } = req.body;
    const sanitizedAuctionId = sanitizeUserInput(auctionId);
    const sanitizedUserId = sanitizeUserInput(userId);
    try {
      const auction = await AuctionModel.getAuctionById(sanitizedAuctionId);
      if (!auction) return res.status(404).json({ error: "Auction not found" });
      if (auction.status !== "ongoing")
        return res.status(400).json({ error: "Auction has ended" });

      // Ensure this is a forward auction
      if (auction.type !== "forward") {
        return res.status(400).json({
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
        sanitizedAuctionId,
        bidAmount,
        sanitizedUserId,
        "ongoing"
      );

      const io = socketConfig.getIO();

      // Enter auction room
      // https://socket.io/docs/v3/rooms/
      io.to(`auction_${sanitizedAuctionId}`).emit("newBid", {
        auctionId: sanitizedAuctionId,
        userId: sanitizedUserId,
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

    // Sanitize all string inputs
    const sanitizedSellerId = sanitizeUserInput(seller_id);
    const sanitizedName = sanitizeUserInput(name);
    const sanitizedDescription = sanitizeUserInput(description);
    const sanitizedImageUrl = sanitizeUserInput(image_url);
    const sanitizedStartTime = sanitizeUserInput(start_time);
    const sanitizedEndTime = sanitizeUserInput(end_time);
    const sanitizedType = sanitizeUserInput(type);

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
    const startDate = new Date(sanitizedStartTime);
    const endDate = new Date(sanitizedEndTime);
    const currentDate = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error:
          "Invalid date format. Expected ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)",
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
        seller_id: sanitizedSellerId,
        name: sanitizedName,
        description: sanitizedDescription,
        starting_price,
        image_url: sanitizedImageUrl,
      });
      if (!item_id)
        return res.status(500).json({ error: "Item creation failed" });
      // Create the auction
      const auctionId = await AuctionModel.createAuction({
        item_id,
        start_time: formatForMySQL(sanitizedStartTime),
        end_time: formatForMySQL(sanitizedEndTime),
        status: "ongoing",
        winner_id: null,
        final_price: null,
        type: sanitizedType,
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
    const sanitizedAuctionId = sanitizeUserInput(auctionId);
    try {
      const result = await AuctionModel.getAuctionById(sanitizedAuctionId);
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
    const sanitizedAuctionId = sanitizeUserInput(auctionId);
    const sanitizedUserId = sanitizeUserInput(userId);
    const sanitizedStatus = sanitizeUserInput(status);

    try {
      await AuctionModel.updateAuctionBid(sanitizedAuctionId, bidAmount, sanitizedUserId, sanitizedStatus);
      res.status(200).json({ message: "Auction updated successfully!" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  updateDutchPrice: async (req, res) => {
    const { auctionId, newPrice } = req.body;
    const sanitizedAuctionId = sanitizeUserInput(auctionId);

    try {
      // Validate that newPrice is greater than 0
      if (newPrice <= 0) {
        return res.status(400).json({ error: "Price must be greater than 0" });
      }

      // Get auction to verify it's a Dutch auction
      const auction = await AuctionModel.getAuctionById(sanitizedAuctionId);
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
        sanitizedAuctionId,
        newPrice
      );
      if (!updated) {
        return res.status(400).json({ error: "Failed to update price" });
      }

      // Emit WebSocket event to all clients in the auction room
      const io = socketConfig.getIO();
      const roomName = `auction_${sanitizedAuctionId}`;
      console.log(`Attempting to emit dutchPriceUpdate to room: ${roomName}`);
      console.log("Event data:", {
        auctionId: sanitizedAuctionId,
        newPrice,
        timestamp: new Date().toISOString(),
      });

      // Get room info for debugging
      const room = io.sockets.adapter.rooms.get(roomName);
      const numClients = room ? room.size : 0;
      console.log(`Number of clients in room ${roomName}: ${numClients}`);

      io.to(roomName).emit("dutchPriceUpdate", {
        auctionId: sanitizedAuctionId,
        newPrice,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        message: "Dutch auction price updated successfully",
        auctionId: sanitizedAuctionId,
        newPrice,
      });
    } catch (error) {
      console.error("Error updating Dutch auction price:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  acceptDutchPrice: async (req, res) => {
    const { auctionId, userId } = req.body;
    const sanitizedAuctionId = sanitizeUserInput(auctionId);
    const sanitizedUserId = sanitizeUserInput(userId);
    try {
      // Get auction to verify it's a Dutch auction
      const auction = await AuctionModel.getAuctionById(sanitizedAuctionId);
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
        sanitizedAuctionId,
        sanitizedUserId
      );
      if (!success) {
        return res
          .status(400)
          .json({ error: "Failed to accept Dutch auction price" });
      }

      // Get the updated auction to get the final price
      const updatedAuction = await AuctionModel.getAuctionById(sanitizedAuctionId);

      // Notify all clients in the auction room
      const io = socketConfig.getIO();
      io.to(`auction_${sanitizedAuctionId}`).emit("auctionEnded", {
        auctionId: sanitizedAuctionId,
        winner: sanitizedUserId,
        finalPrice: updatedAuction.final_price,
        message: "Dutch auction ended - Current price accepted",
      });

      res.status(200).json({
        message: "Dutch auction price accepted successfully",
        auctionId: sanitizedAuctionId,
        finalPrice: updatedAuction.final_price,
      });
    } catch (error) {
      console.error("Error accepting Dutch auction price:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserAuctionWinnings: async (req, res) => {
    const { userId } = req.params;
    const sanitizedUserId = sanitizedUserId(userId);
    if (!sanitizedUserId) {
      return res.status(400).json({ error: "UserId is null" });
    }
    try {
      const rows = await AuctionModel.getAuctionWinnings(sanitizedUserId);
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error getting Auction Winnings:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getAuctionFinalPrice: async (req, res) => {
    const { auctionId } = req.params;
    try {
      const result = await AuctionModel.getAuctionFinalPrice(auctionId);
      if (!result) return res.status(404).json({ error: "Prices not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
   getSellerDutchAuctions: async (req, res) => {
    const { userId } = req.params;
    try {
      const auctions = await AuctionModel.getUserDutchAuctions(userId);
      return res.status(200).json(auctions);
  } catch (error) {
     return res.status(500).json({ error });
  }
  }
};

const formatForMySQL = (isoString) => {
  const date = new Date(isoString);
  return date.toISOString().replace("T", " ").replace(/\..+/, "");
  // "2025-03-25T01:50:07.452Z" → "2025-03-25 01:50:07"
};
module.exports = auctionController;
