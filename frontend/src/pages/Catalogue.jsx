import React, { useState } from "react"

function Catalogue() {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const [error, setError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    setError("")
    fetch(`http://localhost:3000/api/search/fullsearch?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Search failed")
        return res.json()
      })
      .then((data) => setResults(data))
      .catch((err) => {
        console.error(err)
        setError("Error searching items")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Catalogue</h1>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
          <input
            className="border p-2 flex-grow rounded"
            type="text"
            placeholder="Search items..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
          <button
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded transition-colors
            "
            type="submit"
          >
            Search
          </button>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item.auction_id} className="border p-3 rounded shadow-sm">
              <p className="font-semibold">{item.name}</p>
              <p>
                Current Price:{" "}
                {item.final_price !== null
                  ? item.final_price
                  : item.starting_price}
              </p>
              <p>Auction Type: {item.type || "N/A"}</p>
              <p>Status: {item.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Catalogue
