import React, { useState, useEffect } from "react";

const AuctionItem = ({ auction, isSelected, onClick }) => {
  if (!auction) {
    return <p>Error: Auction data is missing</p>;
  }
  const [timeLeft, setTimeLeft] = useState("")
  const { name, description, starting_price, image_url, end_time, status, final_price, type, auction_id} = auction;

  const formatFromMySQL = (mysqlDatetime) => {
    if (!mysqlDatetime) return null;
    // If it's already in ISO format, return as-is
    if (mysqlDatetime.includes('T')) return mysqlDatetime;
    // Handle both "2025-03-25 01:50:07" and "2025-03-25 01:50:07.000" formats
    return mysqlDatetime.trim().endsWith('Z') 
      ? mysqlDatetime 
      : `${mysqlDatetime.replace(' ', 'T')}Z`;
  };

  useEffect(() => {
    if (!auction || !auction.end_time) return;

    const updateCountdown = () => {
      const now = new Date();
      console.log("endtime",end_time)
      const end = new Date(formatFromMySQL(end_time));
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

  
    updateCountdown();
    
    if (auction.status === 'ongoing') {
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [auction]);


  return (
    <div
    className={`p-4 border rounded cursor-pointer ${isSelected ? "bg-blue-200" : "bg-white"}`}
    onClick={() => {
      console.log(`Clicked on ${auction.name}`);
      onClick();
    }}
  >      
      <img src={`http://localhost:3000${image_url}`} alt={name} width={200} />
      <p className="font-semibold">{name}</p>
      <p>Current Price: {final_price !== null ? final_price : starting_price}</p>
      <p>Auction Type: {type || "N/A"}</p>
      <p>Time left: {timeLeft || "N/A"}</p>
      <p>{description}</p>
    </div>
  );
};

export default AuctionItem;
