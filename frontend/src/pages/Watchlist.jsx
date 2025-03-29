import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Trash2 } from "lucide-react"; // Trash icon from Lucide (ShadCN default)
import AuctionItem  from "./Item";

function Watchlist() {
    const { userID } = useUser();
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/watchlist/user/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("watchList", data);
                setWatchlist(data);
            })
            .catch((err) => {
                console.error(err);
                setError("Error fetching watchlist");
            });
    }, [userID]);

    const removeFromWatchlist = async (auctionId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/watchlist/remove`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userID, auction_id: auctionId })
            });

            if (!response.ok) throw new Error("Failed to remove auction from watchlist");

            setWatchlist((prevList) => prevList.filter((item) => item.auction_id !== auctionId));
        } catch (err) {
            console.error(err);
            setError("Error removing auction from watchlist");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-5">
            <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {watchlist.length > 0 ? (
                    watchlist.map((item) => (
                        <div
                            key={item.auction_id}
                        >
                             <AuctionItem auction={item} onClick={()=>{}}isSelected={false} />

                         
                            <button
                                className="text-red-500 hover:text-red-700 transition"
                                onClick={() => removeFromWatchlist(item.auction_id)}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Your watchlist is empty.</p>
                )}
            </div>
        </div>
    );
}

export default Watchlist;
