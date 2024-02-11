const express = require('express');
const router = express.Router();
const times = require('../controllers/timesController');

router.get('/', times.get_train_times);

module.exports = router