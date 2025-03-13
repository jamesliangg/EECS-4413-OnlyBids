import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Receipt() {
  const { paymentId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [amountPaid, setAmountPaid] = useState(null)
  const [shippingDays, setShippingDays] = useState(null)

  useEffect(() => {
    if (!paymentId) return

    setLoading(true)

    // illustration example
    fetch("/api/payment/receipt?paymentId=${paymentId}")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch receipt info")
        }
        return res.json()
      })
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setAmountPaid(data.amountPaid)
          setShippingDays(data.shippingDays)
        }
      })
      .catch((err) => {
        console.error(err)
        setError("Server error while fetching receipt data.")
      })
      .finally(() => setLoading(false))
  }, [paymentId])

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Receipt</h1>

        {error ? (<p className="text-red-500">{error}</p>) : (
          <>
            <p className="mb-4">Thank you for your payment!</p>
            <p className="mb-4">
              Amount Paid:{" "}
              {amountPaid !== null ? (<span className="font-semibold">${amountPaid}</span>) : ("N/A")}
            </p>
            <p>
              Your item will be shipped in {" "}
              {shippingDays !== null ? (<span className="font-semibold">{shippingDays}</span>) : ("N/A")} days
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Receipt

