import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

function AuctionEnded() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // read the auction ID from the query string
  const auctionID = searchParams.get("auctionID")

  const [finalBid, setFinalBid] = useState(null)
  const [winningBidder, setWinningBidder] = useState("")
  const [isWinner, setIsWinner] = useState(false)
  const [expedited, setExpedited] = useState(false)
  const [failure, setFailure] = useState(false)

  useEffect(() => {
    if (!auctionID) return

    // Demonstration scenarios
    if (auctionID === "12233") {
      setFinalBid(100)
      setWinningBidder("You!")
      setIsWinner(true)
      setFailure(false)
    } else if (auctionID === "65535") {
      // Failure scenario
      setFinalBid(999)
      setWinningBidder("JohnDoe")
      setIsWinner(false)
      setFailure(true)
    } else {
      // Default to failure
      setFinalBid(500)
      setWinningBidder("SomeoneElse")
      setIsWinner(false)
      setFailure(true)
    }
  }, [auctionID])

  const handleConfirm = (e) => {
    e.preventDefault()
    if (!isWinner) return

    // navigate to /payment
    navigate("/payment?auctionID=${auctionID}&expedited=${expedited}")
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Auction Ended</h1>

        {/* Auction info */}
        <p className="mb-1 text-center">Auction ID: {auctionID || "N/A"}</p>
        <p className="mb-1 text-center">
          Final bid: {finalBid !== null ? `$${finalBid}` : "N/A"}
        </p>
        <p className="mb-4 text-center">Winning bidder: {winningBidder}</p>

        {/* Failure notice if user not winner */}
        {failure && (
          <p className="text-red-500 mb-4 text-center font-semibold">
            You are not the winning bidder. Failure Notice!
          </p>
        )}

        {/* If user is winner */}
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
