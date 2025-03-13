import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"

function UpdateDutch() {
  const [auctionId, setAuctionId] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [currentPrice, setCurrentPrice] = useState(null)
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!auctionId) return

    // Create a new socket connection
    const newSocket = io({
      // blabla
    })

    setSocket(newSocket)
    newSocket.emit("joinAuction", auctionId)
    newSocket.on("dutchPriceUpdate", (data) => {
      if (data.auctionId === auctionId) {
        setCurrentPrice(data.newPrice)
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [auctionId])

  // PUT request to update the price
  const handleUpdate = (e) => {
    e.preventDefault()
    setMessage("")

    fetch("/api/auction/dutch/price", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId, newPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setMessage(`Error: ${data.error}`)
        else setMessage(data.message || "The price has been updated!")
      })
      .catch((err) => {
        console.error(err)
        setMessage("An error occured in updating Dutch price.")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Update Dutch Auction Price
        </h1>
        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
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
            <label className="block mb-1">New Price</label>
            <input
              className="border p-2 w-full rounded"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
            />
          </div>

          {/* Display the current price */}
          <div className="text-center my-4">
            <p>
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
            Update Price
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateDutch
