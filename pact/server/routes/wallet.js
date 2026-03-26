const express = require('express');
const router = express.Router();
const {
  getWalletBalance,
  depositFunds,
  withdrawFunds
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/wallet/balance
// @desc    Get total aggregated wallet balances across all groups
// @access  Private
router.get('/balance', protect, getWalletBalance);

// @route   POST /api/wallet/deposit
// @desc    Deposit money into a group
// @access  Private
router.post('/deposit', protect, depositFunds);

// @route   POST /api/wallet/withdraw
// @desc    Withdraw money
// @access  Private
router.post('/withdraw', protect, withdrawFunds);

module.exports = router;
