const express = require('express');
const router = express.Router();
const trains = require('../controllers/trainsController');
const times = require('../controllers/timesController')
router.get('/', trains.get_all_trains);

router.get('/:trainid', trains.get_train_stations);

router.use('/:trainid/times', times.get_train_times);

module.exports = router