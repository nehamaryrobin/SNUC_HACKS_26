const express = require('express');
const router = express.Router();
const {
  processDailyStreaks,
  getLeaderboard,
} = require('../controllers/streakController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/streaks/process
// @desc    Cron-style task to process daily streaks and apply penalties
// @access  Private (In production, usually secured by a secret or internal cron)
router.post('/process', protect, processDailyStreaks);

// @route   GET /api/streaks/:groupId/leaderboard
// @desc    Get group leaderboard based on XP / Streaks
// @access  Private
router.get('/:groupId/leaderboard', protect, getLeaderboard);

module.exports = router;
