const express = require('express');
const router = express.Router();
const {
  submitCheckIn,
  verifyCheckIn,
} = require('../controllers/checkinController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/checkins
// @desc    Submit a daily check-in with a photo
// @access  Private
router.post('/', protect, submitCheckIn);

// @route   POST /api/checkins/:id/verify
// @desc    Verify a peer's check-in
// @access  Private
router.post('/:id/verify', protect, verifyCheckIn);

module.exports = router;
