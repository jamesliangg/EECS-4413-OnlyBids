import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//removes any non-digit characters
//set max length
function DigitsOnly(e, setter, maxLen) {
  let val = e.target.value.replace(/\D/g, ""); // remove all non-digits
  if (maxLen && val.length > maxLen) {
    val = val.slice(0, maxLen);
  }
  setter(val);
}

function Payment() {
  const { auction_id, user_id } = useLocation().state;
  const [shippingAddress, setShippingAddress] = useState(
    "4700 Keele St, North York, ON M3J 1P3"
  );
  const [cardNumber, setCardNumber] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [expireMM, setExpireMM] = useState("");
  const [expireYY, setExpireYY] = useState("");
  const [cvv, setCvv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [prices, setPrices] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  // Get the prices of the auction
  useEffect(() => {
    fetch(`http://localhost:3000/api/auction/final-price/${auction_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setPrices(data[0]);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching prices");
      });
  }, [auction_id]);

  //Get winning user address
  useEffect(() => {
    fetch(`http://localhost:3000/api/user/${user_id}/address`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setAddress(
          data[0].street +
            ", " +
            data[0].city +
            ", " +
            data[0].state +
            " " +
            data[0].postal_code
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching prices");
      });
  }, [user_id]);

  // refs for jumping from MM to YY
  const mmRef = useRef(null);
  const yyRef = useRef(null);

  // React Router hook for navigation
  const navigate = useNavigate();

  // after 2 digits, jump to YY
  const handleMMChange = (e) => {
    DigitsOnly(e, setExpireMM, 2);
    if (e.target.value.replace(/\D/g, "").length === 2) {
      yyRef.current.focus();
    }
  };

  const handleYYChange = (e) => {
    DigitsOnly(e, setExpireYY, 2);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setMessage("");

    const paymentData = {
      auction_id,
      buyer_id: user_id,
      isExpedited: false,
      cardNum: cardNumber,
      cardholder,
      expDate: `${expireMM}/${expireYY}`,
      cvv,
    };

    fetch("http://localhost:3000/api/payment/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(`Error: ${data.error}`);
        } else {
          setMessage(data.message || "Payment successful!");
          navigate("/receipt", {
            state: { auction_id, user_id },
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Payment error.");
        navigate("/receipt"); // This is for demonstration
      });
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-2 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Payment</h1>

        <div className="bg-white p-8 mb-4 shadow-md rounded w-80% max-w-md">
          <h2 className="font-semibold">Payment Details</h2>
          <br />
          <p>Subtotal: {parseFloat(prices.final_price)}</p>
          <p>Shipping: {parseFloat(prices.shipping_price)}</p>
          <h3 className="font-semibold">
            Total:{" "}
            {parseFloat(prices.final_price) + parseFloat(prices.shipping_price)}
          </h3>
        </div>

        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}

        {/* Display default shipping address */}
        <div className="mb-4">
          <h2 className="font-semibold">Shipping Address</h2>
          <p>{shippingAddress}</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block mb-1">Credit Card Number</label>
            <input
              className="border p-2 w-full rounded"
              type="text"
              value={cardNumber}
              onChange={(e) => DigitsOnly(e, setCardNumber, 16)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Name on Card</label>
            <input
              className="border p-2 w-full rounded"
              type="text"
              value={cardholder}
              onChange={(e) => setCardholder(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Expiration (MM/YY)</label>
            <div className="flex space-x-2">
              <input
                ref={mmRef}
                className="border p-2 w-16 rounded"
                placeholder="MM"
                value={expireMM}
                onChange={handleMMChange}
                required
              />
              <input
                ref={yyRef}
                className="border p-2 w-16 rounded"
                placeholder="YY"
                value={expireYY}
                onChange={handleYYChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Security Code (CVV)</label>
            <input
              className="border p-2 w-full rounded"
              value={cvv}
              onChange={(e) => DigitsOnly(e, setCvv, 3)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              className="border p-2 w-full rounded"
              value={phoneNumber}
              onChange={(e) => DigitsOnly(e, setPhoneNumber)}
              required
            />
          </div>
          <button
            type="submit"
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;
