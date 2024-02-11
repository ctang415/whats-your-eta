const express = require('express');
const router = express.Router();
const trainsRoute = require('./trains');
const stationsRoute = require('../controllers/stationController');

router.get('/:stationid', stationsRoute.get_station);

router.use('/trains', trainsRoute);

module.exports = router