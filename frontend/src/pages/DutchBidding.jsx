import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"

function DutchBidding() {
  const [auctionId, setAuctionId] = useState("")
  const [userId, setUserId] = useState("")
  const [currentPrice, setCurrentPrice] = useState(null)
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!auctionId) return // only connect if have an auctionId

    // Create a new socket connection
    const newSocket = io({
      // blabla
    })

    // save socket to state
    setSocket(newSocket)

    // join the specific auction room
    newSocket.emit("joinAuction", auctionId)

    // listen to the real-time price updates
    newSocket.on("dutchPriceUpdate", (data) => {
      if (data.auctionId === auctionId) {
        setCurrentPrice(data.newPrice)
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [auctionId])

  const handleBuyNow = (e) => {
    e.preventDefault()
    setMessage("")
    fetch("/api/auction/dutch/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(`Error: ${data.error}`)
        else setMessage(data.message || "Dutch auction price accepted!")
      })
      .catch((err) => {
        console.error(err)
        setMessage("Error accepting Dutch price.")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Dutch Auction Bidding
        </h1>
        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}
        <form className="space-y-4" onSubmit={handleBuyNow}>
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

          {/* Display the current price */}
          <div className="text-center my-4">
            <p className="text-lg">
              Current Price:{" "}
              {currentPrice !== null ? (
                <span className="font-semibold">${currentPrice}</span>
              ) : (
                "N/A"
              )}
            </p>
          </div>

          <button
            type="submit"
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
          >
            Buy Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default DutchBidding
