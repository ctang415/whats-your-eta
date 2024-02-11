const express = require('express');
const router = express.Router();
const trains = require('../controllers/trainsController');
const timesRouter = require('./times');

router.get('/', trains.get_all_trains);

router.get('/:trainid', trains.get_train_stations);

router.use('/:trainid/times', timesRouter);

module.exports = router