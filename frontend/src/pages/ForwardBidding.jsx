import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"

function ForwardBidding() {
  const [auctionId, setAuctionId] = useState("")
  const [userId, setUserId] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [highestBid, setHighestBid] = useState(null)
  const [highestBidder, setHighestBidder] = useState(null)
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!auctionId) return // only connect if have an auctionId

    // Create a new socket connection (adjust options as needed)
    const newSocket = io({
      // blabla
    })

    setSocket(newSocket)

    // join the specific auction room
    newSocket.emit("joinAuction", auctionId)

    // listen to the real time price updates
    newSocket.on("newBid", (data) => {
      if (data.auctionId === auctionId) {
        setHighestBid(data.bidAmount)
        setHighestBidder(data.userId)
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [auctionId])

  // place a new forward bid
  const handlePlaceBid = (e) => {
    e.preventDefault()
    setMessage("")

    fetch("/api/auction/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId, userId, bidAmount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(`Error: ${data.error}`)
        else setMessage(data.message || "Bid placed successfully!")
      })
      .catch((err) => {
        console.error(err)
        setMessage("Error placing bid.")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Forward Auction Bidding
        </h1>

        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}

        <form className="space-y-4" onSubmit={handlePlaceBid}>
          <div>
            <label className="block mb-1">Auction ID</label>
            <input
              className="border p-2 w-full rounded"
              value={auctionId}
              onChange={(e) => setAuctionId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">User ID</label>
            <input
              className="border p-2 w-full rounded"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Bid Amount</label>
            <input
              className="border p-2 w-full rounded"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
          </div>

          {/* Display the highest bid and bidder */}
          <div className="my-4 text-center">
            <p>
              Highest Bid:{" "}
              {highestBid !== null ? (
                <span className="font-semibold">${highestBid}</span>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              By:{" "}
              {highestBidder !== null ? highestBidder : "N/A"}
            </p>
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
      </div>
    </div>
  )
}

export default ForwardBidding

