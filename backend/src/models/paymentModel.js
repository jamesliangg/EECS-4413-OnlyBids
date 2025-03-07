const db = require("../config/database");

const PaymentModel = {
  createPayment: async (paymentData) => {
    try {
      const [paymentResult] = await db.query(
        "INSERT INTO Payment (auction_id, buyer_id, amount, payment_status) VALUES (?, ?, ?, ?)",
        [
          paymentData.auction_id,
          paymentData.buyer_id,
          paymentData.amount,
          paymentData.payment_status,
        ]
      );
      return paymentResult;
    } catch (error) {
      console.error("Error creating payment: ", error);
      throw new Error("Database error: Unable to create payment");
    }
  },
};

module.exports = PaymentModel;
