//const User = require('./models/User');
const { calculateDistanceAndETA } = require('./controllers/locationController');

let roomUsers = {}; // { roomId: { userId: { lat, lng } } }

const handleSocketConnection = (socket, io) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId;
        if (!roomUsers[roomId]) roomUsers[roomId] = {};
        roomUsers[roomId][socket.id] = {};
    });

    socket.on('location-update', async (data) => {
        const { lat, lng } = data;
        const roomId = socket.roomId;
        if (!roomId) return;

        roomUsers[roomId][socket.id] = { lat, lng };

        // Calculate distances/ETAs for all users in the room
        const users = roomUsers[roomId];
        const updatedUsers = await Promise.all(
            Object.keys(users).map(async (id) => {
                let distance = null, duration = null;
                // Find the "me" user for each client
                if (users[socket.id] && users[id]) {
                    try {
                        if (id !== socket.id) {
                            const result = await calculateDistanceAndETA(users[id], users[socket.id]);
                            distance = result.distance;
                            duration = result.duration;
                        }
                    } catch {
                        distance = 'N/A';
                        duration = 'N/A';
                    }
                }
                return {
                    userId: id,
                    lat: users[id]?.lat,
                    lng: users[id]?.lng,
                    distance,
                    eta: duration,
                };
            })
        );

        io.to(roomId).emit('usere-offline', updatedUsers);
    });

    socket.on('disconnect', () => {
        const roomId = socket.roomId;
        if (roomId && roomUsers[roomId]) {
            delete roomUsers[roomId][socket.id];
            io.to(roomId).emit('usere-offline', Object.keys(roomUsers[roomId]).map(id => ({
                userId: id,
                ...roomUsers[roomId][id],
            })));
            if (Object.keys(roomUsers[roomId]).length === 0) {
                delete roomUsers[roomId];
            }
        }
    });
};

module.exports = { handleSocketConnection };