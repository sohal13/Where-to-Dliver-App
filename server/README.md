# 🌍 Real-Time Location Tracker - Server

This README provides an overview of the server-side setup for the Real-Time Location Tracker application built with Node.js, Express, Socket.io, and MongoDB.

---

## 🚀 Features

- Real-time location updates using Socket.io
- User management with MongoDB
- Distance and ETA calculations between users

---

## 🧰 Tech Stack

- **Node.js**: JavaScript runtime for building the server
- **Express**: Web framework for Node.js
- **Socket.io**: Real-time communication library
- **MongoDB**: NoSQL database for storing user data

---

## 📦 Prerequisites

- Node.js >= 14
- MongoDB URI (local or Atlas)
- Distance Matrix API Key (Google or OpenRouteService)

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/realtime-map-tracker.git
cd realtime-map-tracker/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
DISTANCE_API_KEY=your_distance_matrix_api_key
```

### 4. Run the Server

```bash
npm run server
```

---

## 🛠️ Project Structure

```
server/
├── controllers/            # Contains logic for handling requests
│   └── locationController.js
├── models/                 # Mongoose models
│   └── User.js
├── routes/                 # Express routes
│   └── locationRoutes.js
├── socketHandlers.js       # Socket.io event handlers
├── server.js               # Entry point for the Express server
├── package.json            # NPM configuration
└── README.md               # This file
```

---

## 🔁 Socket Event Flow

### Client

- Connects via Socket.io
- Emits `location-update` with user coordinates
- Listens for updates from the server

### Server

- Listens for `location-update` events
- Updates user coordinates in the database
- Calculates distance and ETA using external APIs
- Broadcasts updated user locations to all connected clients

---

## 🌐 APIs Used

### Google Distance Matrix API

- Endpoint: `https://maps.googleapis.com/maps/api/distancematrix/json`
- Input: origin & destination lat/lng
- Output: distance in km, duration in minutes

*Alternative*: OpenRouteService API (Free tier)

---

## 🤝 Contributions

Pull requests and suggestions are welcome! This project is beginner-friendly and a great way to learn about real-time applications with the MERN stack.

---

## 👨‍💻 Author

**Project Lead**: Sohal Rahaman  
For custom integrations or support, feel free to open an issue or PR.