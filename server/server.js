const express = require('express');
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const locationRoutes = require('./routes/locationRoutes');
const { handleSocketConnection } = require('./socketHandlers');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: "https://where-to-dliver.vercel.app", // allow your frontend origin
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://where-to-dliver.vercel.app", // allow your frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});
// Middleware
app.use(express.json());

app.use('/api/locations', locationRoutes);

// MongoDB connection
/*mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));*/

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');
    handleSocketConnection(socket, io);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});