const express = require('express');
const router = express.Router();
const { getMe, getMeStats, getUserProfile, updateMe, getGlobalLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/leaderboard
// @desc    Get global leaderboard
// @access  Private
router.get('/leaderboard', protect, getGlobalLeaderboard);

// @route   GET /api/users/me
// @desc    Get user profile data
// @access  Private
router.get('/me', protect, getMe);

// @route   PATCH /api/users/me
// @desc    Update user profile data
// @access  Private
router.patch('/me', protect, updateMe);

// @route   GET /api/users/me/stats
// @desc    Get dashboard stats (global streak, xp, etc)
// @access  Private
router.get('/me/stats', protect, getMeStats);

// @route   GET /api/users/:userId
// @desc    Get public user profile
// @access  Private
router.get('/:userId', protect, getUserProfile);

module.exports = router;
