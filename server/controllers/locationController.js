// locationController.js
const User = require('../models/User');
const axios = require('axios');

// Update user location
exports.updateLocation = async (req, res) => {
    const { userId, lat, lng } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { lat, lng }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Calculate distance and ETA using OpenRouteService (free)
exports.calculateDistanceAndETA = async (origin, destination) => {
    const apiKey = process.env.ORS_API_KEY; // set this in your .env
    const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';

    try {
        const response = await axios.post(
            url,
            {
                locations: [
                    [origin.lng, origin.lat],      // [lng, lat]
                    [destination.lng, destination.lat]
                ],
                metrics: ['distance', 'duration'],
                units: 'km',
            },
            {
                headers: {
                    Authorization: apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        const distanceKm = response.data.distances[0][1]; // km
        const durationSec = response.data.durations[0][1]; // seconds

        return {
            distance: `${distanceKm.toFixed(2)} km`,
            duration: `${Math.round(durationSec / 60)} mins`,
        };
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw new Error('Error calculating distance and ETA');
    }
};

// ...existing code...

// Get route (polyline) between two points using ORS
exports.getRoute = async (req, res) => {
    const { start, end } = req.body; // { lat, lng }
    const apiKey = process.env.ORS_API_KEY;
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

    try {
        const response = await axios.post(
            url,
            {
                coordinates: [
                    [start.lng, start.lat],
                    [end.lng, end.lat]
                ]
            },
            {
                headers: {
                    Authorization: apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching route', error: error.response?.data || error.message });
    }
};