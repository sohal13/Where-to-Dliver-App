const express = require('express');
const { updateLocation, getAllUsers, getRoute } = require('../controllers/locationController');

const router = express.Router();

router.post('/update', updateLocation);
router.get('/users', getAllUsers);
router.post('/route', getRoute);

module.exports = router;