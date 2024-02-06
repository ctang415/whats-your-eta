const express = require('express');
const router = express.Router();
const trains = require('../controllers/trainsController');

router.get('/', trains.get_all_trains);

router.get('/:trainid', trains.get_train_stations);

module.exports = router