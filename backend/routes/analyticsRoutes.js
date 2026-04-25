const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');

const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/analytics
router.get('/', protect, authorize('admin'), getDashboardStats);

module.exports = router;
