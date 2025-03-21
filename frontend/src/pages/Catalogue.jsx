import React, { useState, useEffect } from "react";

function Catalogue() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]); // For dropdown
  const [results, setResults] = useState([]); // Full search results
  const [error, setError] = useState("");

  // Handle input change & fetch autocomplete suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.length > 1) {
      fetch(`http://localhost:3000/api/search/autocompletion?keyword=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => {
          
          setSuggestions(data)
          console.log(data);
        })
        .catch((err) => console.error("Autocomplete error:", err));
    } else {
      setSuggestions([]);
    }
  };


  const handleSelectSuggestion = (suggestion) => {
    setKeyword(suggestion);
    setSuggestions([]);
  };

  // Handle full search
  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    fetch(`http://localhost:3000/api/search/fullsearch?keyword=${encodeURIComponent(keyword)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then((data) => setResults(data))
      .catch((err) => {
        console.error(err);
        setError("Error searching items");
      });
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Catalogue</h1>

     
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Search items..."
            value={keyword}
            onChange={handleInputChange}
            required
          />

          {suggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border rounded shadow-md mt-1 max-h-48 overflow-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(item.name)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}

          <button
            className="absolute right-0 top-0 bottom-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r transition-colors"
            type="submit"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <ul className="space-y-4 mt-4">
          {results.map((item) => (
            <li key={item.auction_id} className="border p-3 rounded shadow-sm">
              <p className="font-semibold">{item.name}</p>
              <p>Current Price: {item.final_price ?? item.starting_price}</p>
              <p>Auction Type: {item.type || "N/A"}</p>
              <p>Status: {item.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Catalogue;
