const paymentModel = require("../models/paymentModel");
const auctionModel = require("../models/auctionModel");
const exp = require("constants");

const paymentController = {
  attemptPayment: async (req, res) => {
    // Store request body data in local scope so it's available for error handling
    let paymentData;

    try {
      // Get the request body
      paymentData = {
        auction_id,
        buyer_id,
        isExpedited,
        cardNum,
        cardholder,
        expDate,
        cvv,
      } = req.body;

      // Get the auction to verify the winner
      const auction = await auctionModel.getAuctionById(auction_id);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }

      // Check if the buyer is the winner
      if (auction.winner_id != buyer_id) {
        return res
          .status(400)
          .json({ error: "You are not the auction winner" });
      }

      // Validate input
      if (!cardNum || !cardholder || !expDate || !cvv) {
        return res.status(400).json({ error: "All fields are required" });
      }

      var cardNumRegEx = new RegExp("^[0-9]{16}$");
      // Validate card number
      if (!cardNumRegEx.test(cardNum)) {
        return res.status(400).json({ error: "Invalid card number" });
      }

      var cardholderRegEx = new RegExp("^[a-zA-Z\\s]+$");
      // Validate cardholder name
      if (!cardholderRegEx.test(cardholder)) {
        return res.status(400).json({ error: "Invalid cardholder name" });
      }

      // Validate expiry date
      const date = new Date();
      var month = date.getMonth().toString();
      var year = date.getFullYear().toString();
      var expDateRegEx = RegExp("^[0-12]{2}/{1}[0-99]{2}$");

      if (
        !expDateRegEx.test(expDate) &&
        (expDate.substring(3, 5) < year.substring(2, 4) ||
          (expDate.substring(3, 5) > year.substring(2, 4) &&
            expDate.substring(3, 5) < month))
      ) {
        return res.status(400).json({ error: "Invalid card expiry date" });
      }

      var cvvRegEx = new RegExp("^[0-9]{3}$");
      // Validate cvv number
      if (!cvvRegEx.test(cvv)) {
        return res.status(400).json({ error: "Invalid CVV number" });
      }

      var total;
      if (isExpedited == true) {
        total =
          parseFloat(auction.final_price) +
          parseFloat(auction.shipping_price) +
          parseFloat(auction.expedited_price);
      } else {
        total =
          parseFloat(auction.final_price) + parseFloat(auction.shipping_price);
      }

      //Call paymentModel to create row in db
      const payment = await paymentModel.createPayment({
        auction_id,
        buyer_id,
        amount: total,
        payment_status: "completed",
      });

      //If payment creation does not work
      if (!payment) {
        return res.status(500).json({ error: "Payment failed" });
      }

      //Successful payment
      res.status(201).json({ message: "Payment successful!" });
    } catch (error) {
      console.error("Payment error:", error);

      // Send error response first
      res.status(500).json({
        error: "Payment processing error",
        details: error.sqlMessage || error.message,
      });

      // Try to record the failed payment, but don't let it crash if it fails
      try {
        if (paymentData) {
          // Only attempt if we have the payment data
          await paymentModel.createPayment({
            auction_id: paymentData.auction_id,
            buyer_id: paymentData.buyer_id,
            amount: total,
            payment_status: "failed",
          });
        }
      } catch (innerError) {
        // Just log the error, don't crash
        console.error("Failed to record failed payment:", innerError);
      }
    }
  },
};

module.exports = paymentController;
