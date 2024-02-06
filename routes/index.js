const express = require('express');
const router = express.Router();
const trainsRoute = require('./trains');

router.get('/', );

router.use('/trains', trainsRoute);

module.exports = router