const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Process daily streaks (normally run via a corn job)
exports.processDailyStreaks = async (req, res) => {
  try {
    const { groupId } = req.body; // Process a specific group manually for testing

    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    const group = await Group.findById(groupId).populate('members');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Simplistic Streak Logic
    // In a real scenario, this would check if EVERY user in the group had a 'verified' check-in today.
    // If yes, increment groupStreak. If no, reset groupStreak to 0 and distribute pot.
    
    // For demo purposes, we will assume a "miss" happened and trigger a reset to demonstrate "shame cards / stakes redistribution"
    
    const potBefore = group.potAmount;
    
    group.groupStreak = 0;
    group.potAmount = 0; // stakes are "redistributed"
    await group.save();

    // Give remaining members some XP or return pot as "distributed stakes"
    const rewardPerMember = potBefore / (group.members.length || 1);
    
    for (const member of group.members) {
      await User.findByIdAndUpdate(member._id, { $inc: { stakes: rewardPerMember } });
    }

    res.json({ message: 'Daily streaks processed, missed check-ins triggered stake distribution.', group });
  } catch (error) {
    console.error('Error in processDailyStreaks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get the leaderboard for the group
exports.getLeaderboard = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate({
      path: 'members',
      select: 'name avatar xp badges stakes',
      options: { sort: { xp: -1 } }, // sorts by highest XP first
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group.members);
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
