const express = require('express')
const userRoutes = require('./routes/userRoutes')
const searchRoutes = require('./routes/searchRoutes')
const auctionRoutes = require('./routes/auctionRoutes')
const socketConfig = require('./config/socket');
require('dotenv').config()

const app = express()

// Middleware to parse JSON bodies
// https://expressjs.com/en/api.html#express.json
app.use(express.json())

// User routes
app.use('/api', userRoutes)

// Search routes
app.use('/api/search', searchRoutes)

// Auction routes
app.use('api/auction', auctionRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something broke ):' })
})

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketConfig.init(server);


io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Joining Rooms
    // https://socket.io/docs/v3/rooms/
    socket.on('joinAuction', (auctionId) => {
        const roomName = `auction_${auctionId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
      });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// Start the server
// Use the PORT environment variable or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});