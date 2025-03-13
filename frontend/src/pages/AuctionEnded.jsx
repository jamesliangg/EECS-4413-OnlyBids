// src/pages/AuctionEnded.jsx

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

function AuctionEnded() {
  const { auctionId } = useParams() 
  const navigate = useNavigate()

  const [finalBid, setFinalBid] = useState(null)
  const [winningBidder, setWinningBidder] = useState("")
  const [isWinner, setIsWinner] = useState(true) // indicates if thie user is the winner
  const [expedited, setExpedited] = useState(false)
  const [failure, setFailure] = useState(false)   // show failure if not winner
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!auctionId) return
    setLoading(true)

    fetch(`/api/auction/ended?auctionId=${auctionId}`, {
      method: "GET",
      credentials: "include", 
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch auction end info")
        }
        return res.json()
      })
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setFinalBid(data.finalBid)
          setWinningBidder(data.winningBidder)
          setIsWinner(data.isWinner)
          setFailure(!data.isWinner)
        }
      })
      .catch((err) => {
        console.error(err)
        setError("Server error fetching auction end data.")
      })
      .finally(() => setLoading(false))
  }, [auctionId])

  const handleConfirm = (e) => {
    e.preventDefault()
    if (!isWinner){return} // if user is not winner, do nothing

    // otherwise navigate to /payment with shipping choice
    navigate(`/payment?expedited=${expedited}&auctionId=${auctionId}`)
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Auction Ended</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Auction Info */}
        <p className="mb-1 text-center">Auction ID: {auctionId}</p>
        <p className="mb-1 text-center">
          Final bid: {finalBid !== null ? `$${finalBid}` : "N/A"}
        </p>
        <p className="mb-4 text-center">
          Winning bidder: {winningBidder || "N/A"}
        </p>

        {/* if user is not the winner, just show failure notice */}
        {failure && (
          <p className="text-red-500 mb-4 text-center font-semibold">
            You did not win this auction. Failure Notice!
          </p>
        )}

        {/* else, show delivery options, and "pay now" button */}
        {isWinner && (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <p className="font-semibold mb-1">Shipping Option:</p>
              <label className="inline-flex items-center space-x-2 mr-4">
                <input
                  type="radio"
                  name="shipping"
                  value="regular"
                  checked={!expedited}
                  onChange={() => setExpedited(false)}
                />
                <span>Regular Shipping</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value="expedited"
                  checked={expedited}
                  onChange={() => setExpedited(true)}
                />
                <span>Expedited Shipping</span>
              </label>
            </div>
            <button
              type="submit"
              className="
                bg-blue-600 hover:bg-blue-700 text-white 
                px-4 py-2 rounded w-full transition-colors
              "
            >
              Confirm
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuctionEnded
