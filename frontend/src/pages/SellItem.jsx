import React, { useState } from "react"
import { useUser } from "@/context/UserContext"
function SellItem() {
  const { userID } = useUser()
  const [picture, setPicture] = useState(null)
  const [description, setDescription] = useState("")
  const [auctionType, setAuctionType] = useState("")
  const [durationDays, setDurationDays] = useState("")
  const [durationHours, setDurationHours] = useState("")
  const [durationMinutes, setDurationMinutes] = useState("")
  const [startingBid, setStartingBid] = useState("")
  const [uploadMsg, setUploadMsg] = useState("")
  const [sellMsg, setSellMsg] = useState("")
  const [name, setName] = useState("")

  const handleUpload = (e) => {
    e.preventDefault()
    if (!picture) {
      setUploadMsg("No picture selected.")
      return
    }
    const formData = new FormData()
    formData.append("picture", picture)

    fetch("/api/uploadItemPics", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setUploadMsg("Error: ${data.error}")
          console.log("EROR", data.error)
        }
        else setUploadMsg("Picture uploaded successfully!")
      })
      .catch((err) => {
        console.error(err)
        setUploadMsg("Error uploading picture.")
      })
  }

  const handleSellItem = (e) => {
    e.preventDefault()
    
    const days = parseInt(durationDays) || 0;
  const hours = parseInt(durationHours) || 0;
  const minutes = parseInt(durationMinutes) || 0;
  
  if (minutes < 1) {
    setSellMsg("Duration must be at least 1 minute");
    return;
  }

  // Calculate end time
  const now = new Date();
  const endTime = new Date(
    now.getTime() + 
    days * 24 * 60 * 60 * 1000 + 
    hours * 60 * 60 * 1000 + 
    minutes * 60 * 1000
  );

  // Use ISO strings (UTC format)
  const payload = {
    description,
    type: auctionType,
    start_time: now.toISOString(), 
    end_time: endTime.toISOString(),
    starting_price: startingBid,
    seller_id: userID,
    image_url: "url", 
    name
  }
    fetch("http://localhost:3000/api/auction/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setSellMsg("Error: ${data.error}")
        else setSellMsg("Item submitted successfully!")
      })
      .catch((err) => {
        console.error(err)
        setSellMsg("Error submitting item.")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Sell Item</h1>

        <form onSubmit={handleUpload} className="border p-4 space-y-4 rounded"> {/* uploading pictures*/}
          <p className="font-semibold">Upload Picture of The Item</p>
          {uploadMsg && <p className="text-blue-600">{uploadMsg}</p>}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPicture(e.target.files[0])}
          />
          <button
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded transition-colors
            "
            type="submit"
          >
            Upload
          </button>
        </form>

        <form onSubmit={handleSellItem} className="border p-4 space-y-4 rounded">
          {sellMsg && <p className="text-blue-600">{sellMsg}</p>}
          <div>
            <label className="block mb-1">Name</label>
            <textarea
              className="border p-2 w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of item..."
              required
            />
          </div>
          <div>
            <label className="block mb-1">Item Description</label>
            <textarea
              className="border p-2 w-full rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item..."
              required
            />
          </div>
          <div>
            <label className="block mb-1">Auction Type</label>
            <select
              className="border p-2 w-full rounded"
              value={auctionType}
              onChange={(e) => setAuctionType(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose Auction Type...
              </option>
              <option value="forward">Forward Auction</option>
              <option value="dutch">Dutch Auction</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Auction Duration</label>
            <div className="flex space-x-2">
              <input
                className="border p-2 w-20 rounded"
                type="number"
                placeholder="Days"
                max="10"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
              <input
                className="border p-2 w-20 rounded"
                type="number"
                placeholder="Hours"
                max="23"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
              />
              <input
                className="border p-2 w-24 rounded"
                type="number"
                placeholder="Minutes"
                min="1"
                max="59"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Starting Bid Price</label>
            <input
              className="border p-2 w-full rounded"
              type="number"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              required
            />
          </div>
          <button
            className="
              bg-green-600 hover:bg-green-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default SellItem
