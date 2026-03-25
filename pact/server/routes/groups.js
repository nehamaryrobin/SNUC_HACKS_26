const express = require('express');
const router = express.Router();
const {
  createGroup,
  joinGroup,
  getGroupDetails,
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', protect, createGroup);

// @route   POST /api/groups/join
// @desc    Join a group using invite code
// @access  Private
router.post('/join', protect, joinGroup);

// @route   GET /api/groups/:id
// @desc    Get group details (members, streaks, pot)
// @access  Private
router.get('/:id', protect, getGroupDetails);

module.exports = router;
