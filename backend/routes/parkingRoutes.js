const express = require('express');
const router = express.Router();
const { getSlots, assignSmartSlot } = require('../controllers/parkingController');

// @route   GET /api/parking/slots
router.get('/slots', getSlots);

// @route   POST /api/parking/assign
router.post('/assign', assignSmartSlot);

module.exports = router;
