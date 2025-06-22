# 🌍 Real-Time Location Tracker - Client Side

This README file provides documentation specific to the client-side of the Real-Time Location Tracker application built with React, Tailwind CSS, and Socket.io.

---

## 🚀 Overview

The client-side of the application is responsible for rendering the user interface, handling real-time location updates, and displaying user information on a map. It utilizes `react-leaflet` for map rendering and `Socket.io` for real-time communication with the backend.

---

## 📦 Project Structure

```
client/
├── public/
│   └── index.html          # Main HTML file for the React app
├── src/
│   ├── components/         # Contains React components
│   │   ├── Map.jsx        # Map component using react-leaflet
│   │   ├── Sidebar.jsx     # Sidebar displaying active users
│   │   └── UserCard.jsx    # Individual user card in the sidebar
│   ├── socket.js           # Socket.io client setup
│   ├── App.jsx             # Main application component
│   ├── index.js            # Entry point of the React application
│   └── styles.css          # Global styles including Tailwind CSS
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration for Tailwind CSS
├── package.json            # npm configuration for the client
└── README.md               # This README file
```

---

## 🔧 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/realtime-map-tracker.git
   cd realtime-map-tracker/client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

4. **Access the Application**
   Open your browser and visit: `http://localhost:3000`

---

## 🛠️ Features

- Real-time location tracking of users on a map.
- User permission prompts for geolocation access.
- Display of distance and ETA between users.
- Responsive UI with a sidebar showing active users.

---

## 📚 Usage

- The application will prompt for location access upon loading.
- Once granted, the user's location will be tracked and displayed on the map.
- The sidebar will update in real-time to show other connected users and their distances from the current user.

---

## 🤝 Contributions

Contributions are welcome! Feel free to submit pull requests or open issues for any suggestions or improvements.

---

## 👨‍💻 Author

* **Project Lead**: Sohal Rahaman
* For any inquiries or support, please open an issue or PR.