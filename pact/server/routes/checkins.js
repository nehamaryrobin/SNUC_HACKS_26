const express = require('express');
const router = express.Router();
const {
  submitCheckIn,
  verifyCheckIn,
  getHomeworkForReview
} = require('../controllers/checkinController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/checkins
// @desc    Submit a daily check-in with a photo
// @access  Private
router.post('/', protect, submitCheckIn);

// @route   GET /api/checkins/group/:id/review
// @desc    Get assigned homework for review
// @access  Private
router.get('/group/:id/review', protect, getHomeworkForReview);

// @route   POST /api/checkins/:id/verify
// @desc    Verify a peer's check-in
// @access  Private
router.post('/:id/verify', protect, verifyCheckIn);

module.exports = router;
