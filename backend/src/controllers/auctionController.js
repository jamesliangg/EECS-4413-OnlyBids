const AuctionModel = require('../models/auctionModel');
const socketConfig = require('../config/socket');
const ItemModel = require('../models/itemModel');

const auctionController = {
    placeBid: async (req, res) => {
        const { auctionId, userId, bidAmount} = req.body;
        try {
         
          const auction = await AuctionModel.getAuctionById(auctionId);
          if (!auction) return res.status(404).json({ error: 'Auction not found' });
          if (auction.status !== 'ongoing') return res.status(400).json({ error: 'Auction has ended' });
          
          const currentPrice = auction.final_price || 0;
          if (bidAmount <= currentPrice) {
            return res.status(400).json({ error: 'Bid must be higher than current price' });
          }
          
          // Update the auction bid.
          await AuctionModel.updateAuctionBid(auctionId, bidAmount, userId, 'ongoing');
          
          const io = socketConfig.getIO();
      
          // Enter auction room
          // https://socket.io/docs/v3/rooms/
          io.to(`auction_${auctionId}`).emit('newBid', { auctionId, userId, bidAmount });
          res.status(200).json({ message: 'Bid placed successfully!' });
        } catch (error) {
          console.error('Error placing bid:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },

      createAuction: async (req, res) => {
        const { seller_id, name, description, starting_price, image_url, start_time, end_time, type } = req.body;

        try {
            //Create the item
            const item_id = await ItemModel.createItem({ seller_id, name, description, starting_price, image_url });
            if (!item_id) return res.status(500).json({ error: 'Item creation failed' });
            // Create the auction
            const auctionId = await AuctionModel.createAuction({ item_id, start_time, end_time, status: 'ongoing', winner_id: null, final_price: null, type });

            if (!auctionId) return res.status(500).json({ error: 'Auction creation failed' });

            res.status(201).json({ message: 'Auction created successfully!', auctionId, item_id });
        } catch (error) {
            console.error('Error creating auction:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

      getAuction: async (req, res) => {
        const { auctionId } =  req.query
        try {
            const result = AuctionModel.getAuctionById(auctionId);
            if(!result)  return res.status(404).json({ error: 'Auction not found' });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
      },

      getAuctions: async (req, res) => {
        try {
            const result = await AuctionModel.getActiveAuctions();
            if(!result)  return res.status(404).json({ error: 'Auction not found' });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
      },

      updateAuction: async(req, res) => {
        const { auctionId, bidAmount, userId, status}  = req.body;

        try {
            await AuctionModel.updateAuctionBid(auctionId, bidAmount, userId, status);
            res.status(200).json({ message: 'Auction updated successfully!'});
        } catch(error) {
            res.status(500).json({ error: 'Internal server error' });
        }
      }
}

module.exports = auctionController;