const paymentModel = require("../models/paymentModel");
const auctionModel = require("../models/auctionModel");

const paymentController = {
  attemptPayment: async (req, res) => {
    try {
      // Get the request body
      const {
        auction_id,
        buyer_id,
        amount,
        cardNum,
        cardholder,
        expDate,
        cvv,
      } = req.body;

      // Validate auction
      if (getAuctionWinner(auction_id) != buyer_id) {
        return res
          .status(400)
          .json({ error: "You are not the auction winner" });
      }

      // Validate input
      if (!cardNum || !cardholder || !expDate || !cvv) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validate card number
      if (cardNum != new RegExp("^[0-9]{16}$")) {
        return res.status(400).json({ error: "Invalid card number" });
      }

      // Validate cardholder name
      if (cardholder != new RegExp("^[a-zA-Z]{,26}s{,1}[a-zA-Z]{,26}$")) {
        return res.status(400).json({ error: "Invalid cardholder name" });
      }

      // Validate expiry date
      const date = new Date();
      let month = date.getMonth();
      let year = date.getFullYear();
      if (
        expDate != new RegExp("^[0-12]{2}/{1}[0-99]{2}$") &&
        (expDate.substring(3, 5) < year.substring(2, 4) ||
          (expDate.substring(3, 5) > year.substring(2, 4) &&
            expDate.substring(3, 5) < month))
      ) {
        return res.status(400).json({ error: "Invalid card expiry date" });
      }

      // Validate cvv number
      if (cvv != new RegExp("^[0-9]{3}$")) {
        return res.status(400).json({ error: "Invalid CVV number" });
      }

      const d = new Date();
      const payment = await paymentModel.createPayment({
        auction_id,
        buyer_id,
        amount,
        payment_status: "completed",
        d,
      });

      if (!payment) {
        return res.status(500).json({ error: "Payment failed" });
      }

      res.status(201).json({ message: "Payment successful!" });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ error: "Internal server error" });
      const payment = await paymentModel.createPayment({
        auction_id,
        buyer_id,
        amount,
        payment_status: "failed",
        d,
      });
    }
  },
};

module.exports = paymentController;
