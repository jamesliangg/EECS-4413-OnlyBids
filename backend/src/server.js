const express = require('express')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()

const app = express()

// Middleware to parse JSON bodies
// https://expressjs.com/en/api.html#express.json
app.use(express.json())

// User routes
app.use('/api', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something broke ):' })
})

// Start the server
// Use the PORT environment variable or default to 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})