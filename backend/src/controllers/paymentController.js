const paymentModel = require("../models/paymentModel");
const auctionModel = require("../models/auctionModel");
const exp = require("constants");
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

      // Sanitize all string inputs
      const sanitizedAuctionId = sanitizeUserInput(auction_id);
      const sanitizedBuyerId = sanitizeUserInput(buyer_id);
      const sanitizedCardholder = sanitizeUserInput(cardholder);
      const sanitizedExpDate = sanitizeUserInput(expDate);
      const sanitizedCvv = sanitizeUserInput(cvv);

      // Get the auction to verify the winner
      const auction = await auctionModel.getAuctionById(sanitizedAuctionId);
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }

      // Check if the buyer is the winner
      if (auction.winner_id != sanitizedBuyerId) {
        return res
          .status(400)
          .json({ error: "You are not the auction winner" });
      }

      // Validate input
      if (!cardNum || !sanitizedCardholder || !sanitizedExpDate || !sanitizedCvv) {
        return res.status(400).json({ error: "All fields are required" });
      }

      var cardNumRegEx = new RegExp("^[0-9]{16}$");
      // Validate card number
      if (!cardNumRegEx.test(cardNum)) {
        return res.status(400).json({ error: "Invalid card number" });
      }

      var cardholderRegEx = new RegExp("^[a-zA-Z\\s]+$");
      // Validate cardholder name
      if (!cardholderRegEx.test(sanitizedCardholder)) {
        return res.status(400).json({ error: "Invalid cardholder name" });
      }

      // Validate expiry date
      const date = new Date();
      var month = date.getMonth().toString();
      var year = date.getFullYear().toString();
      var expDateRegEx = RegExp("^(0[1-9]{1}|1[0-2]{1})\/{1}[0-9]{2}$");

      if (month < 10) {
        month = 0 + month;
      }

      if (
        !expDateRegEx.test(sanitizedExpDate) ||
        (parseInt(sanitizedExpDate.substring(3, 5)) < parseInt(year.substring(2, 4)) ||
          (parseInt(sanitizedExpDate.substring(3, 5)) >=
            parseInt(year.substring(2, 4)) &&
            parseInt(sanitizedExpDate.substring(0, 2)) < parseInt(month)))
      ) {
        return res.status(400).json({ error: "Invalid card expiry date" });
      }

      var cvvRegEx = new RegExp("^[0-9]{3}$");
      // Validate cvv number
      if (!cvvRegEx.test(sanitizedCvv)) {
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
        auction_id: sanitizedAuctionId,
        buyer_id: sanitizedBuyerId,
        amount: total,
        payment_status: "completed",
      });

      //Call auction to update auction status
      const auctionStatus = await auctionModel.updateAuctionStatus(
        sanitizedAuctionId,
        "completed"
      );

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
            auction_id: sanitizeUserInput(paymentData.auction_id),
            buyer_id: sanitizeUserInput(paymentData.buyer_id),
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
