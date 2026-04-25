const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Protect all routes below

// @route   GET /api/notifications
router.get('/', authorize('admin'), getNotifications);

// @route   PUT /api/notifications/:id
router.put('/:id', authorize('admin'), markAsRead);

module.exports = router;
