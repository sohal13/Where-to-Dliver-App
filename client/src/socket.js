import { io } from "socket.io-client";

const socket = io("https://where-to-dliver-app.onrender.com");

export const joinRoom = (roomId) => {
    socket.emit("join-room", roomId);
};

export const emitLocationUpdate = (location) => {
    socket.emit("location-update", location);
};

export const listenForUsersUpdated = (callback) => {
    socket.on("usere-offline", callback);
};

export default socket;