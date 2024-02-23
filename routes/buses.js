const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/:busid', busController.get_bus);

router.get('/', busController.get_nearby_buses);

//router.get('/', busController.get_realtime)

module.exports = router