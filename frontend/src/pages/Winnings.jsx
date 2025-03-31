import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

function Winnings() {
  const { userID } = useUser();
  const [winnings, setWinnings] = useState([]);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isExpedited, setIsExpedited] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userID) {
      setError("User ID is missing");
      return;
    }

    fetch(`http://localhost:3000/api/auction/winnings/${userID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch winnings");
        return res.json();
      })
      .then((data) => setWinnings(data))
      .catch((err) => {
        console.error(err);
        setError("Error fetching winnings");
      });
  }, [userID]);

  const handlePayment = (auctionId) => {
    navigate("/payment", { state: { auction_id: auctionId, user_id: userID, is_expedited: isExpedited } });
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Winnings</h1>

        {error && <p className="text-red-500">{error}</p>}
        {paymentMessage && <p className="text-green-500">{paymentMessage}</p>}

        <ul className="space-y-4">
          {winnings.length > 0 ? (
            winnings.map((item) => (
              <li key={item.auction_id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-700">{item.description}</p>
                </div>
                <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isExpedited}
                onChange={() => setIsExpedited(!isExpedited)}
                className="form-checkbox"
              />
              <span className="text-gray-700">Expedited Shipping (+$10)</span>
            </label>
                <button
                  onClick={() => handlePayment(item.auction_id)}
                  className="ml-4 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Pay Now
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No winnings found</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Winnings;