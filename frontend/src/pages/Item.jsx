import React, { useState, useEffect } from "react";

const AuctionItem = ({ auction }) => {
  if (!auction) {
    return <p>Error: Auction data is missing</p>;
  }

  const { name, description, starting_price, image_url, end_time, status, final_price, type } = auction;

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

  useEffect(() => {
    if (status === "ongoing") {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [end_time, status]);

  return (
    <li className="border p-3 rounded shadow-sm">
      <img src={image_url} alt={name} width={200} />
      <p className="font-semibold">{name}</p>
      <p>Current Price: {final_price !== null ? final_price : starting_price}</p>
      <p>Auction Type: {type || "N/A"}</p>
      <p>Status: {status}</p>
      <p>Time left: {timeLeft}</p>
      <p>Description: {description}</p>
    </li>
  );
};

export default AuctionItem;
