import React, { useState, useEffect, useRef  } from "react";

function Catalogue() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]); // For dropdown
  const [results, setResults] = useState([]); // Full search results
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  // Handle input change & fetch autocomplete suggestions
   const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.length > 1) {
      fetch(`http://localhost:3000/api/search/autocompletion?keyword=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => {
          setAutocompleteResults(data);
          setShowDropdown(true);
        })
        .catch((err) => console.error("Autocomplete error:", err));
    } else {
      setAutocompleteResults([]);
      setShowDropdown(false);
    }
  };


  const handleSelect = (selectedItem) => {
    setKeyword(selectedItem.name);
    setShowDropdown(false);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Catalogue</h1>
        
        
        <form onSubmit={handleSearch} className="relative">
          <input
            className="border p-2 w-full rounded"
            type="text"
            placeholder="Search items..."
            value={keyword}
            onChange={handleInputChange}
            required
          />
    
          {showDropdown && (
            <ul ref={dropdownRef} className="absolute z-10 bg-white border mt-1 w-full shadow-md rounded">
              {autocompleteResults.length > 0 ? (
                autocompleteResults.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item.name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No results</li>
              )}
            </ul>
          )}

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 w-full">
            Search
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

  
        <ul className="space-y-4 mt-4">
          {results.map((item) => (
            <li key={item.auction_id} className="border p-3 rounded shadow-sm">
              <p className="font-semibold">{item.name}</p>
              <p>Current Price: {item.final_price !== null ? item.final_price : item.starting_price}</p>
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
