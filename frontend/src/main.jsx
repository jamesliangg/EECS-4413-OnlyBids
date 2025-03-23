// src/main.jsx
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import { UserProvider } from "./context/UserContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
  </StrictMode>
)

