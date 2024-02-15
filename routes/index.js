const express = require('express');
const router = express.Router();
const trainsRoute = require('./trains');
const stationsRoute = require('../controllers/stationController');

router.get('/favorites/:stationid', stationsRoute.get_station);

router.get('/', stationsRoute.get_nearby_station);

router.use('/trains', trainsRoute);

module.exports = router