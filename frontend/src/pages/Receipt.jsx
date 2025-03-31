import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Receipt() {
  const { auction_id, user_id } = useLocation().state;
  const [error, setError] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [shippingDays] = useState(14);
  const [userData, setUserData] = useState("");

  // Get the prices of the auction
  useEffect(() => {
    fetch(`http://localhost:3000/api/auction/final-price/${auction_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setAmountPaid(
          parseFloat(data[0].final_price) + parseFloat(data[0].shipping_price)
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching user data");
      });
  }, [auction_id]);

  //Get winning user info
  useEffect(() => {
    fetch(`http://localhost:3000/api/data/user/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUserData(data);
      })
      .catch((err) => {
        console.log("User ID", user_id);
        console.error(err);
        setError("Error fetching user data");
      });
  }, [user_id]);

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Receipt</h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="mb-4">Thank you for your payment!</p>
            <p className="mb-4">
              Amount Paid:{" "}
              {amountPaid !== null ? (
                <span className="font-semibold">${amountPaid}</span>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              Your item will be shipped in{" "}
              {shippingDays !== null ? (
                <span className="font-semibold">{shippingDays}</span>
              ) : (
                "N/A"
              )}{" "}
              days
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Receipt;
