import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

const UpdateDutch = () => {
    const { userID } = useUser();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceInputs, setPriceInputs] = useState({});
    const [message, setMessage] = useState("");

    // Fetch Dutch auctions
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                if (!userID) {
                    setError("User must sign in!");
                    return;
                }
                const response = await fetch(`http://localhost:3000/api/auction/seller/dutch/${userID}`);
                const data = await response.json();
                setAuctions(data);
            } catch (err) {
                setError("Failed to load auctions.");
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, [userID]);

    // Handle price input change
    const handleInputChange = (auctionId, value) => {
        setPriceInputs({ ...priceInputs, [auctionId]: value });
    };

    // Update Dutch auction price
    const handleUpdatePrice = async (auctionId) => {
        const newPrice = priceInputs[auctionId];
        if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
          setError("Invalid price!");
          return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auction/dutch/price", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auctionId, newPrice }),
            });

            if (!response.ok) {
                throw new Error("Failed to update price.");
            }

            setAuctions(auctions.map(a =>
                a.auction_id === auctionId ? { ...a, starting_price: newPrice } : a
            ));
            setMessage(`Auction has been updated to ${newPrice}`)
        } catch (err) {
            setError("Error updating price.");
            console.log(`Error updating price: ${err}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Dutch Auctions</h2>

            {loading && <p>Loading auctions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {message}
            {auctions.length === 0 && !loading ? (
                <p>No Dutch auctions found.</p>
            ) : (
                
                <ul className="space-y-4">
                    {auctions.map((auction) => (
                        <li key={auction.auction_id} className="border p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold">{auction.name}</h3>
                            <p className="text-gray-700">{auction.description}</p>
          
                            <p className="text-gray-500">Price: ${auction?.starting_price || "No Price Listed"}</p>
                            <input
                                type="number"
                                placeholder="Enter new price"
                                value={priceInputs[auction.auction_id] || ""}
                                onChange={(e) => handleInputChange(auction.auction_id, e.target.value)}
                                className="mt-2 p-2 border rounded-lg w-full"
                            />
                            <button 
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={() => handleUpdatePrice(auction.auction_id)}
                            >
                                Update Price
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UpdateDutch;
