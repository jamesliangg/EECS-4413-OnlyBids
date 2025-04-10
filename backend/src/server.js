const express = require("express");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const watchlistRoutes = require("./routes/watchListRoutes");
const socketConfig = require("./config/socket");
const http = require("http");
const cors = require("cors");
const requestLogger = require("./middleware/requestLogger");


require("dotenv").config();

const app = express();

// Enable CORS
app.use(cors());

app.use("/uploads", express.static("public/uploads"));

// Middleware to parse JSON bodies
// https://expressjs.com/en/api.html#express.json
app.use(express.json());

// Request logger middleware
app.use(requestLogger);

// User routes
app.use("/api", userRoutes);

// Search routes
app.use("/api/search", searchRoutes);

// Auction routes
app.use("/api/auction", auctionRoutes);

// Payment routes
app.use("/api/payment", paymentRoutes);

//watchlist routes
app.use("/api/watchlist", watchlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke ):" });
});

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketConfig.init(server);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Log all rooms the socket is in
  console.log("Current rooms:", Array.from(socket.rooms));

  // Joining Rooms
  // https://socket.io/docs/v3/rooms/
  socket.on("joinAuction", (auctionId) => {
    const roomName = `auction_${auctionId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);

    // Log updated room information
    const room = io.sockets.adapter.rooms.get(roomName);
    const numClients = room ? room.size : 0;
    console.log(`Number of clients in room ${roomName}: ${numClients}`);

    // Confirm to the client that they joined
    socket.emit("joinedAuction", { auctionId, roomName });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Log which rooms were left
    console.log("Rooms after disconnect:", Array.from(socket.rooms));
  });
});

// Start the server
// Use the PORT environment variable or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
