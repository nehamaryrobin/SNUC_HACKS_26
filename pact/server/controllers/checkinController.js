const CheckIn = require('../models/CheckIn');
const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Submit a daily check-in
exports.submitCheckIn = async (req, res) => {
  try {
    const { groupId, photoUrl, caption } = req.body;

    if (!groupId || !photoUrl) {
      return res.status(400).json({ message: 'Group ID and Photo URL are required' });
    }

    // Initialize check-in
    const checkIn = await CheckIn.create({
      user: req.user._id,
      group: groupId,
      photoUrl,
      caption,
      status: 'pending',
    });

    res.status(201).json(checkIn);
  } catch (error) {
    console.error('Error in submitCheckIn:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify a peer's check-in
exports.verifyCheckIn = async (req, res) => {
  try {
    const checkInId = req.params.id;
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const checkIn = await CheckIn.findById(checkInId);
    if (!checkIn) {
      return res.status(404).json({ message: 'Check-in not found' });
    }

    // Only allow members of the same group to verify
    const group = await Group.findById(checkIn.group);
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not in this group' });
    }

    // You cannot verify your own check-in
    if (checkIn.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot verify your own check-in' });
    }

    // Update check-in status
    checkIn.status = status;
    checkIn.verifiedBy = req.user._id;
    await checkIn.save();

    // If verified, update group streaks & user xp
    if (status === 'verified') {
      // Simplistic streak logic here (more complex logic might be needed for group streaks)
      await User.findByIdAndUpdate(checkIn.user, { $inc: { xp: 10 } });
      await Group.findByIdAndUpdate(checkIn.group, { $inc: { groupXp: 10 } });
    } else {
      // If rejected, there can be a shame card or stake redistribution logic
      // Note: In a real app, logic for distributing stakes happens when streaks are broken
    }

    res.json(checkIn);
  } catch (error) {
    console.error('Error in verifyCheckIn:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
