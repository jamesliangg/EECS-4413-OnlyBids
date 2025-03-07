const db = requre("../config/database");

const PaymentModel = {
  createPayment: async ({
    auction_id,
    buyer_id,
    amount,
    payment_status,
    payment_date,
  }) => {
    try {
      const [paymentResult] = await db.query(
        "INSERT INTO Payment (auction_id, buyer_id, amount, payment_status, payment_date VALUES (?, ?, ?, ?, ?)",
        [auction_id, buyer_id, amount, payment_status, payment_date]
      );
      return paymentResult;
    } catch (error) {
      console.error("Error creating payment: ", error);
      throw new Error("Database error: Unable to create payment");
    }
  },
};

module.exports = PaymentModel;
