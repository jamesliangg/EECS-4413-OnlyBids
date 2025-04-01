import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Receipt() {
  const navigate = useNavigate();
  const { auction_id, user_id, final_price, is_expedited } =
    useLocation().state;
  const [error, setError] = useState("");
  const [shippingDays, setShippingDays] = useState(14);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    if (is_expedited === true) {
      setShippingDays(7);
    }
  }, [is_expedited]);

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
        setUserData(data[0]);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching user data");
      });
  }, [user_id]);

  const handleHome = () => {
    navigate("/catalogue", { state: { user_id } });
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Receipt</h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="mb-4">Thank you for your payment!</p>
            <p className="mb-4">
              <span className="font-semibold">Username: </span>
              {userData.username}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Street: </span>
              {userData.street}
            </p>
            <p className="mb-4">
              <span className="font-semibold">City: </span>
              {userData.city}
            </p>
            <p className="mb-4">
              <span className="font-semibold">State/Province: </span>
              {userData.state}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Country: </span>
              {userData.country}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Postal Code: </span>
              {userData.postal_code}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Total Paid: </span>
              {final_price.toFixed(2)}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Auction ID: </span>
              {auction_id}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Amount Paid: </span>$
              {final_price.toFixed(2)}
            </p>
            <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
            <p className="mb-4">
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

        <button
          type="button"
          className="
              mb-4 bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
          onClick={handleHome}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}

export default Receipt;
