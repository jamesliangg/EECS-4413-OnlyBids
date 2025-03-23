import React, { useState, useEffect } from "react";

const AuctionItem = ({ auction, isSelected, onClick }) => {
  if (!auction) {
    return <p>Error: Auction data is missing</p>;
  }

  const { name, description, starting_price, image_url, end_time, status, final_price, type, auction_id} = auction;

  // Function to calculate remaining time
  function calculateTimeLeft() {
    const now = new Date(); 
    const end = new Date(end_time);

    const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    
    const diff = end - nowUTC; 
    console.log(end, nowUTC)
    if (diff <= 0) {
        return "Auction ended";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}


  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
/*
  useEffect(() => {
    if (status === "ongoing") {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [end_time, status]);
*/

  return (
    <li
    className={`p-4 border rounded cursor-pointer ${isSelected ? "bg-blue-200" : "bg-white"}`}
    onClick={() => {
      console.log(`Clicked on ${auction.name}`);
      onClick();
    }}
  >      
      <img src={image_url} alt={name} width={200} />
      <p className="font-semibold">{name}</p>
      <p>Current Price: {final_price !== null ? final_price : starting_price}</p>
      <p>Auction Type: {type || "N/A"}</p>
      <p>Status: {status}</p>
      <p>Time left: {timeLeft || "N/A"}</p>
      <p>Description: {description}</p>
    </li>
  );
};

export default AuctionItem;
