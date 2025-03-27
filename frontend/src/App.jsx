import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import Catalogue from "./pages/Catalogue"
import ForwardBidding from "./pages/ForwardBidding"
import DutchBidding from "./pages/DutchBidding"
import UpdateDutch from "./pages/UpdateDutch"
import Payment from "./pages/Payment"
import Receipt from "./pages/Receipt"
import SellItem from "./pages/SellItem"
import AuctionEnded from "./pages/AuctionEnded"
import { useUser } from "@/context/UserContext" 


function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <div
        className="
          absolute inset-0
          bg-cover bg-center
          bg-zoom        /* custom class from index.css */
        "
        style={{
          backgroundImage: "url('/src/images/homepage-background.jpeg')", 
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="bg-white/70 backdrop-blur p-8 rounded-md shadow-md max-w-md w-full mx-4 text-center">
          <h1 className="text-2xl font-bold mb-6">
            Welcome to OnlyBids
          </h1>
          <p className="mb-6 text-gray-600">
            Your Price, Your Choice!
          </p>

          <div className="flex justify-center space-x-4">
            <Link to="/signin">
              <button
                className="
                  bg-blue-500 text-white px-6 py-2 rounded 
                  transition-transform duration-300 ease-in-out 
                  hover:scale-105 hover:shadow-lg
                "
              >
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button
                className="
                  bg-green-500 text-white px-6 py-2 rounded 
                  transition-transform duration-300 ease-in-out 
                  hover:scale-105 hover:shadow-lg
                "
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { userID } = useUser()
  return (
    <Router>
      <nav className="px-8 py-4 bg-slate-900 shadow flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-gray-50"
        >
          OnlyBids
        </Link>

        
        {userID && (<div className="flex space-x-6">
          <Link
            to="/catalogue"
            className="text-gray-300 hover:text-gray-100 transition-colors"
          >
            Catalogue
          </Link>
          <Link
            to="/sell-item"
            className="text-gray-300 hover:text-gray-100 transition-colors"
          >
            Sell Item
          </Link>
        </div>)}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/forward-bidding" element={<ForwardBidding />} />
        <Route path="/dutch-bidding" element={<DutchBidding />} />
        <Route path="/update-dutch" element={<UpdateDutch />} />
        <Route path="/auction-ended" element={<AuctionEnded />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/sell-item" element={<SellItem />} />
      </Routes>
    </Router>
  )
}

export default App
