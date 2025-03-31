import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

function ForwardBidding() {
  const navigate = useNavigate();
  const { userID } = useUser();
  const location = useLocation();
  const auction = location.state?.auction;

  const [auctionId, setAuctionId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const shippingPrice = "22";
  const [isHighestBidder, setisHighestBidder] = useState(false);
  const formatFromMySQL = (mysqlDatetime) => {
    if (!mysqlDatetime) return null;
    // If it's already in ISO format, return as-is
    if (mysqlDatetime.includes("T")) return mysqlDatetime;
    // Handle both "2025-03-25 01:50:07" and "2025-03-25 01:50:07.000" formats
    return mysqlDatetime.trim().endsWith("Z")
      ? mysqlDatetime
      : `${mysqlDatetime.replace(" ", "T")}Z`;
  };
  useEffect(() => {
    setAuctionId(auction?.auction_id);
    setHighestBid(auction?.final_price);
    setHighestBidder(auction?.winner_id);

    if (auction?.end_time) {
      const auctionEndTime = new Date(
        formatFromMySQL(auction?.end_time)
      ).getTime();
      setisHighestBidder(
        Date.now() > auctionEndTime && auction?.winner_id == userID
      );
    }
  }, [auction]);

  useEffect(() => {
    if (!auctionId) return;
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(newSocket.id);
    });

    newSocket.emit("joinAuction", auctionId);

    // Listen for bid updates
    newSocket.on("joinedAuction", (data) => {
      console.log(`${data.roomName}-${userID}:Joined room`);
    });
    newSocket.on("newBid", (data) => {
      setHighestBid(data?.bidAmount);
      setHighestBidder(data?.userId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [auctionId]);

  // Place a new forward bid
  const handlePlaceBid = (e) => {
    e.preventDefault();
    setMessage("");

    fetch("http://localhost:3000/api/auction/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId, userId: userID, bidAmount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(`Error: ${data.error}`);
        else setMessage(data.message || "Bid placed successfully!");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error placing bid.");
      });
  };
  const handlePayment = () => {
    navigate("/payment", { state: { auction_id: auctionId, user_id: userID } });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Forward Auction Bidding
        </h1>

        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Item Details</h2>
          <p className="text-gray-700">Description: {auction?.description}</p>
          <p className="text-gray-700">Shipping Price: ${shippingPrice}</p>
        </div>

        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold">Current Auction Status</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Current Price:</span>{" "}
            {highestBid !== null
              ? `$${highestBid}`
              : auction?.starting_price
              ? `$${auction.starting_price}`
              : "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Highest Bidder:</span>{" "}
            {highestBidder ? highestBidder : "No bids so far!"}
          </p>
        </div>

        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}

        {!isHighestBidder && (
          <form className="space-y-4" onSubmit={handlePlaceBid}>
            <div>
              <label className="block mb-1 font-semibold">Enter Your Bid</label>
              <input
                className="border p-2 w-full rounded"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
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
              Place Bid
            </button>
          </form>
        )}
        {isHighestBidder && (
          <button
            type="submit"
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
            onClick={() => handlePayment()}
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
}

export default ForwardBidding;
