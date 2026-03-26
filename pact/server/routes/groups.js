const express = require('express');
const router = express.Router();
const {
  createGroup,
  joinGroup,
  getGroupDetails,
  getReviewAssignments,
  applyPenalty,
  getUserGroups,
  getExploreGroups,
  getGroupActivity,
  getGroupCalendar,
  getGroupMembers,
  getGroupStake,
  getGroupAccountability,
  submitGroupCheckin
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/groups
// @desc    Get all groups for logged-in user
// @access  Private
router.get('/', protect, getUserGroups);

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', protect, createGroup);

// @route   GET /api/groups/public/explore
// @desc    Get public groups a user can join
// @access  Private
router.get('/public/explore', protect, getExploreGroups);

// @route   POST /api/groups/join
// @desc    Join a group using invite code
// @access  Private
router.post('/join', protect, joinGroup);

// @route   GET /api/groups/:id/review-assignments
// @desc    Get circular review assignments
// @access  Private
router.get('/:id/review-assignments', protect, getReviewAssignments);

// @route   POST /api/groups/:id/apply-penalty
// @desc    Apply penalty directly to member
// @access  Private
router.post('/:id/apply-penalty', protect, applyPenalty);

// @route   GET /api/groups/:id/activity
// @desc    Get Group Activity Heatmap
// @access  Private
router.get('/:id/activity', protect, getGroupActivity);

// @route   GET /api/groups/:id/calendar
// @desc    Get Group Calendar Status
// @access  Private
router.get('/:id/calendar', protect, getGroupCalendar);

// @route   GET /api/groups/:id/members
// @desc    Get formatted group members
// @access  Private
router.get('/:id/members', protect, getGroupMembers);

// @route   GET /api/groups/:id/stake
// @desc    Get group stake panel
// @access  Private
router.get('/:id/stake', protect, getGroupStake);

// @route   GET /api/groups/:id/accountability
// @desc    Get accountability chain
// @access  Private
router.get('/:id/accountability', protect, getGroupAccountability);

// @route   POST /api/groups/:id/checkin
// @desc    Check-in specifically for a group
// @access  Private
router.post('/:id/checkin', protect, submitGroupCheckin);

// @route   GET /api/groups/:id
// @desc    Get group details (members, streaks, pot)
// @access  Private
router.get('/:id', protect, getGroupDetails);

module.exports = router;
