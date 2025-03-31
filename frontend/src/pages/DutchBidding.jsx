import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

function DutchBidding() {
  const navigate = useNavigate();
  const { userID } = useUser();
  const location = useLocation();
  const auction = location.state?.auction;
  console.log("auction");

  const [auctionId, setAuctionId] = useState("")
 // const [userId, setUserId] = useState("")
  const [currentPrice, setCurrentPrice] = useState(null)
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [winner, setWinner] = useState(null)
  const [isBid, setIsBid] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completedMessage, setCompletedMessage] = useState("")
  const [isExpedited, setIsExpedited] = useState(false);
  const shippingPrice = "22"
    useEffect(() => {
      setAuctionId(auction?.auction_id)
      setIsCompleted(auction?.winner_id === userID)
    }, [])

  useEffect(() => {
    if (!auctionId) return; // only connect if have an auctionId

    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    // save socket to state
    setSocket(newSocket);

    // join the specific auction room
    newSocket.emit("joinAuction", auctionId);

    newSocket.on("joinedAuction", (data) => {
      console.log(`${data.roomName}-${userID}:Joined room`);
    });

    // listen to the real-time price updates
    /*
     io.to(`auction_${auctionId}`).emit("auctionEnded", {
        auctionId,
        winner: userId,
        finalPrice: updatedAuction.final_price,
        message: "Dutch auction ended - Current price accepted",
      });
    */
    newSocket.on("auctionEnded", (data) => {
      setWinner(data?.winner);
      setCompletedMessage(data.message);
      setIsBid(data?.winner === userID);
      setIsCompleted(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [auctionId]);
  const handlePayment = () => {
    navigate("/payment",{state: {auction_id: auctionId, user_id: userID}});
  }

  const handleBuyNow = (e) => {
    setMessage("");
    fetch("http://localhost:3000/api/auction/dutch/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId, userId: userID }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(`Error: ${data.error}`);
        else setMessage(data.message || "Dutch auction price accepted!");
        setIsBid(true);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error accepting Dutch price.");
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Dutch Auction Bidding
        </h1>

        {/* Item Details Section */}
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Item Details</h2>
          <p className="text-gray-700">Description: {auction.description}</p>
          <p className="text-gray-700">Shipping Price: ${shippingPrice}</p>
        </div>

        {/* Current Price and Highest Bidder Section */}
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Current Auction Status</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Current Price:</span>{" "}
            {auction.starting_price ? `$${auction.starting_price}` : "N/A"}
          </p>
        </div>

        {/* Message Display */}
        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}
        {!isBid && (
          <p className="text-red-600 mb-4 text-center">{completedMessage}</p>
        )}
        {!isBid && !isCompleted && (
          <button
            type="submit"
            className="
            bg-blue-600 hover:bg-blue-700 text-white 
            px-4 py-2 rounded w-full transition-colors
          "
          onClick={() => {handleBuyNow()}}
        >
          Place Bid
        </button>)}
        {isBid && (
          <div className="mt-4">
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
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full transition-colors mt-4"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        )}
    </div>
  );
}

export default DutchBidding
