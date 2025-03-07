const paymentModel = require("../models/paymentModel");
const auctionModel = require("../models/auctionModel");
const exp = require("constants");

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

      //Test Variable
      var winner_id = 33;

      // Validate auction
      if (winner_id != buyer_id) {
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
      var expDateRegEx = RegExp("^[0-12]{2}\/{1}[0-99]{2}$");

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

      //Call paymentModel to create row in db
      const payment = await paymentModel.createPayment({
        auction_id,
        buyer_id,
        amount,
        payment_status: "completed"
      });

      //If payment creation does not work
      if (!payment) {
        return res.status(500).json({ error: "Payment failed" });
      }

      //Successful payment
      res.status(201).json({ message: "Payment successful!" });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ error: "Internal server error" });
      const payment = await paymentModel.createPayment({
        auction_id,
        buyer_id,
        amount,
        payment_status: "failed"
      });
    }
  },
};

module.exports = paymentController;
