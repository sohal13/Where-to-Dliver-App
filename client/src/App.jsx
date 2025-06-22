import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import socket, { emitLocationUpdate, listenForUsersUpdated, joinRoom } from './socket';
import axios from 'axios';

const getRoomIdFromUrl = () => {
    const match = window.location.pathname.match(/room\/([^/]+)/);
    return match ? match[1] : null;
};

const App = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [route, setRoute] = useState(null);
    const [roomInput, setRoomInput] = useState('');
    const [roomId, setRoomId] = useState(getRoomIdFromUrl());
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    console.log('====================================');
    console.log(windowWidth);
    console.log('====================================');


    // Handle room creation
    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (roomInput.trim()) {
            window.location.pathname = `/room/${encodeURIComponent(roomInput.trim())}`;
        }
    };

    useEffect(() => {
        const currentRoomId = getRoomIdFromUrl();
        if (!currentRoomId) return;
        setRoomId(currentRoomId);
        joinRoom(currentRoomId);

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        const handleLocation = (position) => {
            const { latitude, longitude } = position.coords;
            emitLocationUpdate({ lat: latitude, lng: longitude });
        };

        const handleError = () => {
            alert('Location permission denied. Please allow location access.');
        };

        navigator.geolocation.getCurrentPosition(handleLocation, handleError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });

        listenForUsersUpdated(setUsers);

        return () => {
            socket.off('usere-offline');
        };
    }, [window.location.pathname]);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!selectedUser) {
                setRoute(null);
                setLoadingRoute(false);
                return;
            }
            const me = users.find(u => u.userId === socket.id);
            if (!me) return;
            setLoadingRoute(true);
            try {
                const res = await axios.post('https://where-to-dliver-app.onrender.com/api/locations/route', {
                    start: { lat: me.lat, lng: me.lng },
                    end: { lat: selectedUser.lat, lng: selectedUser.lng }
                });
                setRoute(res.data);
            } catch (err) {
                setRoute(null);
            }
            setLoadingRoute(false);
        };
        fetchRoute();
    }, [selectedUser, users]);

    const mySocketId = socket.id;
    const usersWithMe = users.map(u => ({
        ...u,
        isMe: u.userId === mySocketId
    }));

    // If no room in URL, show room creation UI
    if (!roomId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <form onSubmit={handleCreateRoom} className="bg-white p-8 rounded shadow">
                    <h2 className="mb-4 text-xl font-bold">Create or Join a Room</h2>
                    <input
                        type="text"
                        value={roomInput}
                        onChange={e => setRoomInput(e.target.value)}
                        placeholder="Enter room name"
                        className="border p-2 rounded w-full mb-4"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        Go to Room
                    </button>
                </form>
            </div>
        );
    }

    // Show the room URL for sharing
    const roomUrl = `${window.location.origin}/room/${encodeURIComponent(roomId)}`;

    return (
        <div className="relative flex flex-col h-screen overflow-hidden">
            {/* Top Bar */}
            <div className="sticky top-0 z-30 bg-gradient-to-r from-green-600 to-yellow-600 p-2 text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between ">
                    <div className="flex items-center w-full md:w-auto">
                        {windowWidth < 768 && !isSidebarOpen && (
                            <button
                                className="md:hidden mr-3 bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/20 transition"
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open sidebar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}
                        <span className="font-semibold tracking-wide text-white ">Room:</span>
                        <span className="ml-2 px-2 py-1 bg-white text-purple-700 rounded-md font-mono text-sm">{roomId}</span>
                    </div>

                    <div className="flex flex-col justify-center self-center sm:flex-row items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                        <div className="flex items-center w-full sm:w-auto max-w-md">
                            <input
                                type="text"
                                value={roomUrl}
                                readOnly
                                className="flex-1 border-none px-3 py-2 rounded-l-md text-sm text-gray-700 bg-white focus:outline-none"
                                onFocus={e => e.target.select()}
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(roomUrl);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1500);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-r-md text-sm font-medium transition"
                                id="copyBtn"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative flex flex-1 overflow-hidden">
                {isSidebarOpen && (
                    <Sidebar
                        users={usersWithMe}
                        onSelectUser={setSelectedUser}
                        selectedUserId={selectedUser?.userId}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                        windowWidth={windowWidth}
                    />
                )}

                <div className="flex-1 relative z-0 bg-gradient-to-br from-blue-50 to-purple-100">
                    {loadingRoute && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        </div>
                    )}
                    <Map
                        users={usersWithMe}
                        mySocketId={socket.id}
                        route={route}
                        selectedUser={selectedUser}
                        selectedUserId={selectedUser?.userId}
                    />
                </div>
            </div>
        </div>
    );

};

export default App;